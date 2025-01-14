module.exports = {


  friendlyName: 'View new license',


  description: 'Display "New license" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/customers/new-license'
    },

    redirect: {
      description: 'The requesting user already has a subscription, or does not exist',
      responseType: 'redirect',
    }

  },


  fn: async function () {

    // if the user isn't logged in, we'll redirect them to the register page.
    if (!this.req.me) {
      throw {redirect: '/customers/register'};
    }

    // If the user has a license key, we'll redirect them to the customer dashboard.
    let userHasExistingSubscription = await Subscription.findOne({user: this.req.me.id});
    if (userHasExistingSubscription) {
      throw {redirect: '/customers/dashboard?login'};
    }

    // Respond with view.
    return { stripePublishableKey: sails.config.custom.stripePublishableKey};

  }


};
