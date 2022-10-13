import React, {useEffect, useMemo} from 'react';
import {useWindowDimensions} from 'react-native';
import RenderHTML from 'react-native-render-html';
import {WebView} from 'react-native-webview';
import IframeRenderer, {iframeModel} from '@native-html/iframe-plugin';
import TableRenderer, {tableModel} from '@native-html/table-plugin';
import TrackPlayer, {State} from 'react-native-track-player';

const HtmlView = ({
  html,
  baseStyle,
  contentWidth = 32,
  tagsStyles,
  renderers = {},
  ...props
}) => {
  useEffect(() => {
    // console.log("HTML View")
  }, []);

  const memoRenderers = useMemo(
    () => ({
      iframe: IframeRenderer,
      table: TableRenderer,
      ...renderers,
    }),
    [],
  );

  const memoCustomHTMLElementModels = useMemo(
    () => ({
      iframe: iframeModel,
      table: tableModel,
    }),
    [],
  );

  const {width} = useWindowDimensions();

  const memoDefaultWebViewProps = useMemo(
    () => ({
      startInLoadingState: true,
      onTouchStart: async () => {
        if (State.Playing == (await TrackPlayer.getState())) {
          let track = await TrackPlayer.getQueue();

          if (track.length) {
            await TrackPlayer.pause();
          }
        }
      },
      mediaPlaybackRequiresUserAction: false,
      allowsFullscreenVideo: true,
    }),
    [],
  );

  const memoRenderersProps = useMemo(
    () => ({
      iframe: {
        scalesPageToFit: true,
      },
    }),
    [],
  );

  const memoHtml = useMemo(
    () => ({
      html: html,
    }),
    [],
  );

  const memoIgnoredDomTags = useMemo(() => ['audio'], []);

  if (!html) {
    return null;
  }

  return (
    <RenderHTML
      baseStyle={baseStyle}
      contentWidth={width - contentWidth}
      renderers={memoRenderers}
      WebView={WebView}
      source={memoHtml}
      customHTMLElementModels={memoCustomHTMLElementModels}
      renderersProps={memoRenderersProps}
      defaultWebViewProps={memoDefaultWebViewProps}
      ignoredDomTags={memoIgnoredDomTags}
      tagsStyles={tagsStyles}
      {...props}
    />
  );
};

export default HtmlView;
