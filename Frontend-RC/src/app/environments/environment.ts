export const environment = {
  production: false,
  urlBase: 'http://localhost:8080/api',
  useMockBackend: false,
  keycloak: {
    url: 'http://localhost:8081',
    realm: 'canchacraft',
    clientId: 'canchacraft-frontend'
  }
};
