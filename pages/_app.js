import UserProvider from "../context/userContext";
import DbProvider from "../context/dbContext";
import "../styles/index.css";

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

// Custom App to wrap it with context provider
export default ({ Component, pageProps }) => (
  <UserProvider>
    <DbProvider>
      <Component {...pageProps} />
    </DbProvider>
  </UserProvider>
);
