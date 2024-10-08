import React, { useMemo } from 'react';
import { View, useWindowDimensions } from 'react-native';
import RenderHTML from 'react-native-render-html';
import { WebView } from 'react-native-webview';
import IframeRenderer, { iframeModel } from '@native-html/iframe-plugin';
import TableRenderer, { tableModel } from '@native-html/table-plugin';
import TrackPlayer, { State } from 'react-native-track-player';
import { APP_COLORS } from '../constants/constants';

const HtmlView = ({
  html,
  baseStyle,
  contentWidth = 32,
  tagsStyles = {},
  renderers = {},
  ...props
}) => {
  const memoTagsStyles = useMemo(
    () => ({
      p: { color: APP_COLORS.font, ...tagsStyles?.p },
      span: { color: APP_COLORS.font, ...tagsStyles?.span },
    }),
    [],
  );

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

  const { width } = useWindowDimensions();

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
      androidHardwareAccelerationDisabled: true,
      style: { opacity: 0.99, overflow: 'hidden' },
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
    [html],
  );

  const memoIgnoredDomTags = useMemo(() => ['audio'], []);

  if (!html) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
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
        tagsStyles={memoTagsStyles}
        {...props}
      />
    </View>
  );
};

export default HtmlView;
