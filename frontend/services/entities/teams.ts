import sendRequest from "services";
import endpoints from "fleet/endpoints";
import { INewMembersBody, IRemoveMembersBody, ITeam } from "interfaces/team";
import { ICreateTeamFormData } from "pages/admin/TeamManagementPage/components/CreateTeamModal/CreateTeamModal";

interface ILoadAllTeamsResponse {
  teams: ITeam[];
}

interface ILoadTeamResponse {
  team: ITeam;
}

interface IGetTeamSecretsResponse {
  secrets: any[]; // TODO: fill this out when API is defined
}

interface ITeamSearchOptions {
  page?: number;
  perPage?: number;
  globalFilter?: string;
}

export default {
  create: (formData: ICreateTeamFormData) => {
    const { TEAMS } = endpoints;

    return sendRequest("POST", TEAMS, formData);
  },
  destroy: (teamId: number) => {
    const { TEAMS } = endpoints;
    const path = `${TEAMS}/${teamId}`;

    return sendRequest("DELETE", path);
  },
  load: (teamId: number) => {
    const { TEAMS } = endpoints;
    const path = `${TEAMS}/${teamId}`;

    return sendRequest("GET", path);
  },
  loadAll: ({
    page = 0,
    perPage = 100,
    globalFilter = "",
  }: ITeamSearchOptions = {}) => {
    const { TEAMS } = endpoints;

    // TODO: add this query param logic to client class
    const pagination = `page=${page}&per_page=${perPage}`;

    let searchQuery = "";
    if (globalFilter !== "") {
      searchQuery = `&query=${globalFilter}`;
    }

    const path = `${TEAMS}?${pagination}${searchQuery}`;

    return sendRequest("GET", path);
  },
  update: (teamId: number, updateParams: ITeam) => {
    const { TEAMS } = endpoints;
    const path = `${TEAMS}/${teamId}`;

    return sendRequest("PATCH", path, updateParams);
  },
  addMembers: (teamId: number, newMembers: INewMembersBody) => {
    const { TEAMS_MEMBERS } = endpoints;
    const path = TEAMS_MEMBERS(teamId);

    return sendRequest("PATCH", path, newMembers);
  },
  removeMembers: (teamId: number, removeMembers: IRemoveMembersBody) => {
    const { TEAMS_MEMBERS } = endpoints;
    const path = TEAMS_MEMBERS(teamId);

    return sendRequest("DELETE", path, removeMembers);
  },
  transferHosts: (teamId: number, hostIds: number[]) => {
    const { TEAMS_TRANSFER_HOSTS } = endpoints;
    const path = TEAMS_TRANSFER_HOSTS(teamId);

    return sendRequest("POST", path, { id: hostIds });
  },
  getEnrollSecrets: (teamId: number) => {
    const { TEAMS_ENROLL_SECRETS } = endpoints;
    const path = TEAMS_ENROLL_SECRETS(teamId);

    return sendRequest("GET", path);
  },
};