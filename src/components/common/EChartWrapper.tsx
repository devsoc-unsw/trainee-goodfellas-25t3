import React, { useRef } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
// @ts-ignore - WebView will be installed separately
import WebView from 'react-native-webview';
// @ts-ignore - ECharts types are optional
import type { EChartsOption } from 'echarts';

export type EChartWrapperProps = {
  option: EChartsOption;
  width?: number | string;
  height?: number | string;
  backgroundColor?: string;
};

/**
 * Reusable ECharts component using WebView.
 * 
 * Usage:
 * ```tsx
 * <EChartWrapper 
 *   option={chartOption} 
 *   height={300}
 * />
 * ```
 */
export const EChartWrapper: React.FC<EChartWrapperProps> = ({
  option,
  width = '100%',
  height = 300,
  backgroundColor = 'transparent',
}) => {
  const webViewRef = useRef<WebView>(null);

  // Generate HTML with embedded ECharts
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html, body {
            width: 100%;
            height: 100%;
            overflow: hidden;
            background-color: ${backgroundColor};
          }
          #chart {
            width: 100%;
            height: 100%;
          }
        </style>
      </head>
      <body>
        <div id="chart"></div>
        <script src="https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js"></script>
        <script>
          (function() {
            try {
              const chartDom = document.getElementById('chart');
              const myChart = echarts.init(chartDom, null, {
                renderer: 'canvas',
                useDirtyRect: false
              });
              
              const option = ${JSON.stringify(option)};
              
              myChart.setOption(option);
              
              // Auto-resize on window resize
              window.addEventListener('resize', function() {
                myChart.resize();
              });
              
              // Send success message to React Native
              window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'loaded' }));
            } catch (error) {
              window.ReactNativeWebView?.postMessage(JSON.stringify({ 
                type: 'error', 
                message: error.message 
              }));
            }
          })();
        </script>
      </body>
    </html>
  `;

  return (
    <View style={[styles.container, { width: width as any, height: height as any }]}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html }}
        style={styles.webView}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onMessage={(event: any) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'error') {
              console.error('ECharts error:', data.message);
            }
          } catch (e) {
            // Ignore
          }
        }}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="small" color="#1a7fe6" />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  webView: {
    backgroundColor: 'transparent',
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
