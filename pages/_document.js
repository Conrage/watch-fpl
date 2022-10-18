import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html>
            <Head>
                <meta name="google-site-verification" content="d9h0wAMpo4KhnrihbaQ5mfgRPtYxli482bq4Pkfn63k" />
                <meta name="description" content="Website to watch FPL live matches and twitch streams" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="preconnect" href="https://fonts.googleapis.com"></link>
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossorigin
                ></link>
                <link
                    href="https://fonts.googleapis.com/css2?family=Play:wght@400;700&display=swap"
                    rel="stylesheet"
                ></link>
                <link rel="preconnect" href="https://fonts.googleapis.com"></link>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin></link>
                <link href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@300;400;500;600;700&display=swap" rel="stylesheet"></link>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}