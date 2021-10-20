import "./App.css";
import { FluentBundle, FluentResource } from "@fluent/bundle";
import {
  Localized,
  LocalizationProvider,
  ReactLocalization,
} from "@fluent/react";
import React, { Component } from 'react';


/**
 * Fetches ftl file of different locales.
 * Returns the locale and the ftl string grouped as an Array.
 */
async function fetchMessages(locale) {
  const response = await fetch(process.env.PUBLIC_URL+`./locales/${locale}/app.ftl`);
  const messages = await response.text();
  return [locale, messages];
}
// A generator function responsible for building the sequence
// of FluentBundle instances in the order of user's language
// preferences.
function* generateBundles(fetchedMessages) {
  for (const [locale, messages] of fetchedMessages) {
    const resource = new FluentResource(messages);
    const bundle = new FluentBundle(locale);
    bundle.addResource(resource);
    yield bundle;
  }
}

/**
 * 
 
const AVAILABE_LOCALE = ["bn, "en", "hi", "ur"]; //Keep the 'Locale Code'

const languages = negotiateLanguages(
  navigator.languages,
  
  // This is your list of supported locales.
  AVAILABLE_LOCALES,
  
  // Setting defaultLocale to your reference locale means that it will
  // always be the last fallback locale, thus making sure the UI is
  // always working.
  { defaultLocale: 'en-US' },
);

 */
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {locale: 'en', l10n: new ReactLocalization([]), loading: true};

    this.handleChange = this.handleChange.bind(this);
  }

  async getFTLData() {
    const fetchedMessages = await fetchMessages(this.state.locale);
    console.log(fetchedMessages);
    const bundles = generateBundles([fetchedMessages]);
    const l10n = new ReactLocalization(bundles);
    return this.setState({ l10n, loading:false });
  }

  componentDidMount() {
    this.getFTLData();
  }

  componentDidUpdate() {
    this.getFTLData();
  }

  handleChange(event) {
    this.setState({locale: event.target.value});
  }


  render() {
    if(!this.state.loading){
      return (
        <LocalizationProvider l10n={this.state.l10n}>
          <div className="App Glass">
            <Localized id="hello">
              <h1>Hello, World!</h1>
            </Localized>
            <input className="cta-card__input" type="text" value={this.state.locale} onChange={this.handleChange} />
            <h2>Availabe Locales are: 'en', 'bn', 'hi', 'ur'.</h2>
          </div>
        </LocalizationProvider>
      );
    }else {
      return(<div className="App Glass"><h1>loading..</h1></div>)
    }
  }
}

export default App;
