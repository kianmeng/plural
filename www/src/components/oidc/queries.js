import { gql } from "apollo-boost";
import { OIDCProvider } from "../../models/oauth";
import { RepoFragment } from "../../models/repo";

export const CREATE_PROVIDER = gql`
  mutation Provider($id: ID!, $attributes: OIDCAttributes!) {
    createOidcProvider(installationId: $id, attributes: $attributes) {
      ...OIDCProvider
    }
  }
  ${OIDCProvider}
`

export const OAUTH_LOGIN = gql`
  query Login($challenge: String!) {
    oauthLogin(challenge: $challenge) { 
      ...RepoFragment 
    }
  }
  ${RepoFragment}
`

export const ACCEPT_LOGIN = gql`
  mutation AcceptLogin($challenge: String!) {
    acceptLogin(challenge: $challenge) { redirectTo }
  }
`

export const OAUTH_CONSENT = gql`
  mutation Consent($challenge: String!, $scopes: [String]) {
    oauthConsent(challenge: $challenge, scopes: $scopes) { redirectTo }
  }
`