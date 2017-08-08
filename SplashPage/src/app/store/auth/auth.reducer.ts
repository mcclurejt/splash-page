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
    
    case AuthActions.START_LOADING: {
      console.log('START_LOADING');
      return {
        loading: true,
        isSignedIn: state.isSignedIn,
        currentUser: state.currentUser,
      }
    }

    case AuthActions.STOP_LOADING: {
      console.log('STOP_LOADING');
      return {
        loading: false,
        isSignedIn: state.isSignedIn,
        currentUser: state.currentUser,
      }
    }

    case AuthActions.STATE_CHANGE: {
      console.log('UPDATE',action);
      if(action.payload == null){
        return {
          loading: state.loading,
          isSignedIn: false,
          currentUser: null,};
      }
      return {
        loading: state.loading,
        isSignedIn: true,
        currentUser: action.payload,
      }
    }

    default: {
      return state;
    }
  }
}