import decode from 'jwt-decode';

class AuthService {
  getProfile() {
    return decode(this.getToken());
  }

  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  }

  getToken() {
    const token = localStorage.getItem('token');
    console.log("Retrieved JWT:", token);  // For debugging purposes only
    return token;
}

  login(idToken) {
    console.log("Storing JWT:", idToken);  // For debugging purposes only
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
}


  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('token');
    // this will reload the page and reset the state of the application
    window.location.assign('/');
  }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;

