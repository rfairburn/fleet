package service

import (
	"context"

	"github.com/fleetdm/fleet/v4/server/fleet"
	"github.com/pkg/errors"
)

/////////////////////////////////////////////////////////////////////////////////
// Delete
/////////////////////////////////////////////////////////////////////////////////

type deleteHostsRequest struct {
	IDs     []uint `json:"ids"`
	Filters struct {
		MatchQuery string           `json:"query"`
		Status     fleet.HostStatus `json:"status"`
		LabelID    *uint            `json:"label_id"`
		TeamID     *uint            `json:"team_id"`
	} `json:"filters"`
}

type deleteHostsResponse struct {
	Err error `json:"error,omitempty"`
}

func (r deleteHostsResponse) error() error { return r.Err }

func deleteHostsEndpoint(ctx context.Context, request interface{}, svc fleet.Service) (interface{}, error) {
	req := request.(*deleteHostsRequest)
	listOpt := fleet.HostListOptions{
		ListOptions: fleet.ListOptions{
			MatchQuery: req.Filters.MatchQuery,
		},
		StatusFilter: req.Filters.Status,
		TeamFilter:   req.Filters.TeamID,
	}
	err := svc.DeleteHosts(ctx, req.IDs, listOpt, req.Filters.LabelID)
	if err != nil {
		return deleteHostsResponse{Err: err}, nil
	}
	return deleteHostsResponse{}, nil
}

func (svc Service) DeleteHosts(ctx context.Context, ids []uint, opts fleet.HostListOptions, lid *uint) error {
	if err := svc.authz.Authorize(ctx, &fleet.Host{}, fleet.ActionList); err != nil {
		return err
	}

	if len(ids) > 0 && (lid != nil || !opts.Empty()) {
		return &badRequestError{"Cannot specify a list of ids and filters at the same time"}
	}

	if len(ids) > 0 {
		err := svc.checkWriteForHostIDs(ctx, ids)
		if err != nil {
			return err
		}
		return svc.ds.DeleteHosts(ctx, ids)
	}

	hostIDs, err := svc.hostIDsFromFilters(ctx, opts, lid)
	if err != nil {
		return err
	}

	if len(hostIDs) == 0 {
		return nil
	}

	err = svc.checkWriteForHostIDs(ctx, hostIDs)
	if err != nil {
		return err
	}
	return svc.ds.DeleteHosts(ctx, hostIDs)
}

func (svc Service) checkWriteForHostIDs(ctx context.Context, ids []uint) error {
	for _, id := range ids {
		host, err := svc.ds.Host(ctx, id)
		if err != nil {
			return errors.Wrap(err, "get host for delete")
		}

		// Authorize again with team loaded now that we have team_id
		if err := svc.authz.Authorize(ctx, host, fleet.ActionWrite); err != nil {
			return err
		}
	}
	return nil
}