import * as React from "react";
import * as routes from "../../constants/routes";
import { auth, db } from "../../Firebase";
import {Roles} from "../../State";

interface InterfaceProps {
  history?: any;
}

interface InterfaceState {
  error: any;
  roles: Roles;
}

export class GoogleSignIn extends React.Component<InterfaceProps, InterfaceState> {
  private static INITIAL_STATE = {
    error: "",
    roles: {
      isAdmin: true,
      isSales: true
    }
  };

  private static propKey(propertyName: string, value: any): object {
    return { [propertyName]: value };
  }

  constructor(props: InterfaceProps) {
    super(props);
    this.state = { ...GoogleSignIn.INITIAL_STATE };
  }

  public onSubmit = (event: any) => {
    const { history } = this.props;

    auth.doSignInWithGoogle()
      .then((socialAuthUser: any) => {
        this.setState({error: null});
        history.push(routes.HOME);
        const roles = {isAdmin: true, isSales: false};
        console.log(socialAuthUser.user);
        // Create a user in your own accessible Firebase Database
        db.doCreateUser(socialAuthUser.user.uid, socialAuthUser.user.email, socialAuthUser.user.email, roles)
          .then(() => {
            this.setState(() => ({...GoogleSignIn.INITIAL_STATE}));
          })
          .catch((error: any) => {
            this.setState(error);
          });
      })
      .catch((e: any) => {
        this.setState({error: e});
      });

    event.preventDefault();
  };

  public render() {
    const { error } = this.state;
    return (
      <form onSubmit={e => this.onSubmit(e)}>
        <button type="submit"> Sign In with Google </button>
        {error && <p>{error.message}</p>}
      </form>
    );
  }

  private setStateWithEvent(event: any, columnType: string): void {
    this.setState(GoogleSignIn.propKey(columnType, (event.target as any).value));
  }
}