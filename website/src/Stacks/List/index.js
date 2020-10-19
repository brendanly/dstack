// @flow

import React, {useEffect, Fragment} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {NotFound, StackList, UploadStack} from '@dstackai/dstack-react';
import {isSignedIn} from '@dstackai/dstack-react/dist/utils';
import {useAppProgress} from '@dstackai/dstack-react/dist/hooks';
import {fetchList, deleteStack} from './actions';
import {useParams} from 'react-router';
import routes from 'routes';
import config from 'config';

type Stack = {
    [key: string]: any,
} | string;

type Props = {
    data: Array<Stack>,
    loading: boolean,
    fetchList: Function,
    deleteStack: Function,
    requestStatus: ?number,
    currentUser?: string,
    currentUserToken?: string,
    startAppProgress: Function,
    completeAppProgress: Function,
    resetAppProgress: Function,
};

const List = ({
    requestStatus,
    fetchList,
    data = [],
    loading,
    deleteStack,
    currentUser,
    currentUserToken,
}: Props) => {
    const {startAppProgress, completeAppProgress, resetAppProgress} = useAppProgress();
    const {t} = useTranslation();
    const {user} = useParams();


    const fetchData = () => {
        startAppProgress();
        fetchList(user, completeAppProgress);
    };

    useEffect(() => {
        fetchData();

        return () => {
            resetAppProgress();
        };
    }, [user]);


    if (requestStatus === 404)
        return <NotFound>
            {t('theStackYouAreRookingForCouldNotBeFound')}
            {' '}
            {isSignedIn() && (
                <Fragment>
                    <Link to={routes.stacks(currentUser)}>
                        {t('goToMyStacks')}
                    </Link>.
                </Fragment>
            )}
        </NotFound>;

    return (
        <Fragment>
            <Helmet>
                <title>dstack.ai | {user}</title>
            </Helmet>

            <StackList
                user={user}
                data={data}
                loading={loading}
                currentUser={currentUser}
                deleteStack={deleteStack}

                {...(currentUser === user
                    ? {
                        renderUploadStack: () => (
                            <UploadStack
                                withFileUpload
                                user={user}
                                configurePythonCommand={config.CONFIGURE_PYTHON_COMMAND(currentUserToken, user)}
                                configureRCommand={config.CONFIGURE_R_COMMAND(currentUserToken, user)}
                                refresh={fetchData}
                                apiUrl={config.API_URL}
                            />
                        ),
                    }

                    : {}
                )}
            />
        </Fragment>
    );
};

export default connect(
    state => ({
        data: state.stacks.list.data,
        requestStatus: state.stacks.list.requestStatus,
        loading: state.stacks.list.loading,
        currentUser: state.app.userData?.user,
        currentUserToken: state.app.userData?.token,
    }),

    {
        fetchList,
        deleteStack,
    },
)(List);
