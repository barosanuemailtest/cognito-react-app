import React from "react";
import { Login } from "./components/auth/login";
import { AuthService } from "./services/AuthService";
import { DataService } from "./services/DataService";
import { Router, Route, Switch } from 'react-router-dom';
import { AppNavbar } from "./components/Navbar";
import { Home } from "./components/Home";
import { CognitoUser } from "@aws-amplify/auth";
import history from './history';
import { Profile } from "./components/Profile";
import { Spaces } from "./components/spaces/Spaces";
import { CreateSpace } from "./components/spaces/CreateSpace";

interface AppState {
    user: CognitoUser | undefined;
    userName: string | undefined;
}

export class App extends React.Component<{}, AppState> {

    private authService: AuthService = new AuthService();
    private dataService: DataService = new DataService(this.authService);

    constructor(props) {
        super(props);
        this.state = {
            user: undefined,
            userName: undefined
        }
        this.setCognitoUser = this.setCognitoUser.bind(this);
    }

    private async setCognitoUser(user: CognitoUser) {
        const cognitoUserName = user.getUsername();
        this.setState({
            user: user,
            userName: cognitoUserName
        })
        await this.authService.getAwsCredentials(user);
    };

    render() {
        return (
            <div className="wrapper">
                <Router history={history}>
                    <div>
                        <AppNavbar userName={this.state.userName} />
                        <Switch>
                            <Route exact path='/' component={Home} />
                            <Route exact path='/login'>
                                <Login authService={this.authService} setCognitoUser={this.setCognitoUser} />
                            </Route>
                            <Route exact path='/profile' >
                                <Profile user={this.state.user} dataService={this.dataService}/>
                            </Route>
                            <Route exact path='/spaces' >
                                <Spaces user={this.state.user} dataService={this.dataService}/>
                            </Route>
                            <Route exact path='/createSpace' >
                                <CreateSpace user={this.state.user} dataService={this.dataService}/>
                            </Route>
                        </Switch>
                    </div>
                </Router>
            </div>
        )
    }

}
