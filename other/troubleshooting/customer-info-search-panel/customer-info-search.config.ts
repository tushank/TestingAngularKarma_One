
export const CustomerSearchConfig = {
    MODAL_CONFIG : {
        BASE_CONFIG: {
            class: 'modal-md',
            backdrop: true,
            ignoreBackdropClick: true,
            initialState: {
              header: '',
              message: '',
              type: 'info', // error, success, info(default)
              buttonsList: [
                  {
                      buttonName: 'Ok',
                      type: 'close',
                      callback: null
                  }
                //  ,
                //   {
                //     buttonName: 'Ok',
                //     type: 'custom',
                //     callback: null
                // }
              ]
            }
          },
        MESSAGES : {
            INVALID_CARD_NUM_MSG: 'Invalid card number, please enter digits only',
            INVALID_ACC_NUM_MSG: 'Invalid account number, please enter digits only',
            REQUIRED_MSG: 'You are required to complete one or more fields to begin the search.',
            CARD_NUM_NAME_REQ_MSG: 'Both Card Number and Customer Name are required fields.'
        }

    }
};
