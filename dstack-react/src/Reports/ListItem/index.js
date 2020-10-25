// @flow
import React, {useRef} from 'react';
import {get} from 'lodash-es';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import Dropdown from '../../Dropdown';
import StackAttachment from '../../stack/Attachment';
import type {Dashboard} from '../types';
import css from './styles.module.css';

type Props = {
    dashboard: Dashboard,
    deleteDashboard?: Function,
    renderContent?: Function,
}

const Item = ({dashboard, deleteDashboard, user, renderContent}: Props) => {
    const {t} = useTranslation();
    const ref = useRef(null);

    const hasStacks = dashboard.cards && Boolean(dashboard.cards.length);
    const card = dashboard.cards.find(c => get(c, 'head.id'));
    const isShowDropdown = Boolean(deleteDashboard);

    return (
        <Link
            to={`/${user}/d/${dashboard.id}`}
            className={css.item}
            ref={ref}
        >
            {Boolean(dashboard.cards.length) && (
                <div className={css.label}>
                    {t('stacksWithCount', {count: dashboard.cards.length})}
                </div>
            )}

            <div className={css.previewWrap}>
                {hasStacks
                    ? <StackAttachment
                        className={css.attachment}
                        isList
                        withLoader
                        frameId={card.head.id}
                        stack={card.stack}
                        id={0}
                    />

                    : <div className={css.emptyMessage}>{t('emptyDashboard')}</div>
                }
            </div>

            <div className={css.section}>
                <div className={css.content}>
                    <div className={css.name}>
                        {dashboard.title}
                        {' '}
                        <span className={`mdi mdi-lock${dashboard.private ? '' : '-open'}`} />
                    </div>

                    {user !== dashboard.user && (
                        <div className={css.by}>{t('by')} {dashboard.user}</div>
                    )}

                    {renderContent && renderContent(dashboard)}
                </div>

                {isShowDropdown && <Dropdown
                    className={css.dropdown}

                    items={[
                        {
                            title: t('delete'),
                            onClick: deleteDashboard,
                        },
                    ]}
                />}
            </div>

        </Link>
    );
};

export default Item;
