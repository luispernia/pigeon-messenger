



function userReducer(state, action) {
    switch (action.type) {
        case 'CREATE':
          return {name: "Luis Pernia"};
        case 'CHANGE':
          return {name: "Joe Doe"};
        default:
          throw new Error();
      }
}

export default userReducer;