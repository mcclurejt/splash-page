import * as firebase from 'firebase/app';
import * as AuthActions from 'app/store/auth/auth.actions';

export interface State {
  loading: boolean,
  isSignedIn: boolean,
  currentUser: firebase.User,
}

const initialState: State = {
  loading: false,
  isSignedIn: false,
  currentUser: null,
}

export function reducer(state = initialState, action: AuthActions.All): State {
  switch (action.type) {

    case (AuthActions.HANDLE_SIGNIN): {
      return {
        loading: false,
        isSignedIn: true,
        currentUser: action.payload,
      }
    }

    case (AuthActions.HANDLE_SIGNOUT): {
      return {
        loading: false,
        isSignedIn: false,
        currentUser: null,
      }
    }

    case (AuthActions.START_LOADING): {
      return {
        loading: true,
        isSignedIn: state.isSignedIn,
        currentUser: state.currentUser,
      }
    }

    case (AuthActions.STOP_LOADING): {
      return {
        loading: false,
        isSignedIn: state.isSignedIn,
        currentUser: state.currentUser,
      }
    }

    default: {
      return state;
    }
  }
}