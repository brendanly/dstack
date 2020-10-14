import React, {memo, useEffect, useState, useRef} from 'react';
import cx from 'classnames';
import {useTranslation} from 'react-i18next';
import Plot from 'react-plotly.js';
import {isEqual, get} from 'lodash-es';
import {unicodeBase64Decode} from '../../../utils';
import Table from './Table';
import {isImageType, base64ToJSON} from '../utils';
import * as CSV from 'csv-string';
import css from './styles.module.css';

const base64ImagePrefixes = {
    'image/svg+xml': 'data:image/svg+xml;charset=utf-8;',
    'image/png': 'data:image/png;charset=utf-8;',
    'image/jpeg': 'data:image/jpeg;charset=utf-8;',
};


const View = ({frameId, attachment, fullAttachment, isList, className, requestStatus}) => {
    const {t} = useTranslation();
    const viewRef = useRef();
    const [tableScale, setTableScale] = useState(1);
    const [viewWidth, setVieWidth] = useState(0);
    const [noRender, setNoRender] = useState(false);

    const onResizeCard = () => {
        if (viewRef.current) {
            const containerWidth = viewRef.current.parentElement.offsetWidth;
            const viewWidth = viewRef.current.offsetWidth / tableScale;

            let newScale = containerWidth / viewWidth;

            if (newScale > 1)
                newScale = 1;

            setTableScale(newScale);
            setVieWidth(containerWidth);
        }
    };

    useEffect(() => {
        if (window && isList)
            window.addEventListener('resize', onResizeCard);

        return () => {
            if (window && isList)
                window.removeEventListener('resize', onResizeCard);
        };
    }, []);

    useEffect(() => {
        if (noRender)
            setNoRender(false);
    }, [noRender]);

    useEffect(() => {
        if (attachment && attachment['application'] === 'plotly') {
            setNoRender(true);
        }
        if (attachment && attachment['application'] === 'bokeh') {
            let Bokeh;
            const json = base64ToJSON(attachment.data);
            const version = get(attachment, 'settings.bokeh_version');

            if (version && parseInt(version.split('.')[0], 10) === 2) {
                Bokeh = window.Bokeh['2.2.1'];
            } else {
                Bokeh = window.Bokeh;
            }

            if (json && document.querySelector(`#bokeh-${frameId}`))
                Bokeh.embed.embed_item(json, `bokeh-${frameId}`);
        }

        if (isList)
            setTimeout(() => onResizeCard(), 10);

    }, [attachment]);

    const renderImage = () => {
        if (!attachment.preview)
            return (
                <img
                    src={`${base64ImagePrefixes[attachment['content_type']]}base64,${attachment.data}`}
                    alt=""
                />
            );
        else if (fullAttachment) {
            if (fullAttachment['download_url']) {
                return (
                    <img src={fullAttachment['download_url']} alt=""/>
                );
            } else
                return (
                    <img
                        src={`${base64ImagePrefixes[attachment['content_type']]}base64,${attachment.data}`}
                        alt=""
                    />
                );
        }

        return null;
    };

    const renderCSV = () => {
        const decodeCSV = unicodeBase64Decode(attachment.data);

        if (decodeCSV) {
            const data = CSV.parse(decodeCSV);

            if (Array.isArray(data) && data.length)
                return (
                    <Table
                        data={data}
                    />
                );
        }

        return (
            <div className={css.text}>{t('notSupportedAttachment')}</div>
        );
    };

    const renderPlotly = () => {
        const json = base64ToJSON(attachment.data);

        if (!json)
            return null;

        json.layout.width = viewWidth;
        json.layout.margin = 0;
        json.layout.autosize = true;

        if (json.config)
            json.config.responsive = true;
        else
            json.config = {responsive: true};

        return (
            <Plot
                {...json}
                style={{
                    width: '100%',
                    height: '100%',
                }}
                useResizeHandler
            />
        );
    };

    const renderBokeh = () => <div id={`bokeh-${frameId}`} />;

    const renderAttachment = () => {
        if (noRender)
            return null;

        if (requestStatus === 404 && isList)
            return <div className={css.message}>{t('notFound')}</div>;

        if (requestStatus === 404 && !isList)
            return <div className={css.text}>{t('noPreview')}</div>;

        if (attachment.preview && isList && isImageType(attachment['content_type']))
            return <div className={css.message}>{t('noPreview')}</div>;

        switch (true) {
            case (attachment['content_type'] === 'image/svg+xml'):
            case (attachment['content_type'] === 'image/png'):
            case (attachment['content_type'] === 'image/jpeg'):
                return renderImage();

            case (attachment['content_type'] === 'text/csv'):
                return renderCSV();

            case (attachment['application'] === 'plotly'):
                return renderPlotly();

            case (attachment['application'] === 'bokeh'):
                return renderBokeh();

            case undefined:
            case isEqual(attachment, {}):
                return null;

            default:
                return <div className={isList ? css.message : css.text}>{t('notSupportedAttachment')}</div>;
        }
    };

    return (
        <div
            ref={viewRef}
            className={cx(css.view, className, {
                'table': (attachment && attachment.data && attachment['content_type'] === 'text/csv'),
                'bokeh': (attachment && attachment.data && attachment['application'] === 'bokeh'),
            })}

            style={
                (attachment && attachment['content_type'] === 'text/csv')
                    ? {transform: `scale(${tableScale})`}
                    : {}
            }
        >
            {renderAttachment()}
        </div>
    );
};


const areEqual = (prevProps, nextProps) => {
    return isEqual(prevProps.attachment, nextProps.attachment);
};

export default memo(View, areEqual);
