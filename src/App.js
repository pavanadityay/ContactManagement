import './App.css';
import ContactTable from "./components/ContactTable";
import ContactData from "./components/ContactData";
import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import axios from 'axios';
/* This class holds all our logic related to Update, delete, search and sort contacts. */
class App extends React.Component {
  state = {
    contacts: [],   // To store the fetched contacts
    isLoading: true, // To track loading state
    error: null,    // To track error state
    mssg: "",
    cacheSearch: [],
    isAscending: true, // New state for sorting
  };

  componentDidMount() {
    this.fetchContacts();
  }

  fetchContacts = () => {
    axios.get('http://localhost:5000/api/contacts')
      .then(response => {
          const contacts = response.data;
          const cacheSearch = response.data;
          this.setState({ contacts, isLoading: false, cacheSearch });
      })
      .catch(error => {
          console.error("Error fetching data:", error);
          this.setState({ error: "Error fetching data.", isLoading: false });
      });
  }

  handleContactDeleted = () => {
    this.fetchContacts();
  }

  handleSortByName = () => {
    const { contacts, isAscending } = this.state;

    const sortedContacts = [...contacts].sort((a, b) => {
      if (isAscending) {
        if (a.lName.toLowerCase() < b.lName.toLowerCase()) return -1;
        if (a.lName.toLowerCase() > b.lName.toLowerCase()) return 1;
      } else {
        if (a.lName.toLowerCase() > b.lName.toLowerCase()) return -1;
        if (a.lName.toLowerCase() < b.lName.toLowerCase()) return 1;
      }
      return 0;
    });

    this.setState({ contacts: sortedContacts, isAscending: !isAscending });
  }

  searchContact = (input) => {
    const value = (input?.target?.value).toLowerCase();
    const cacheSearch = [...this.state.cacheSearch];
    if (String(value).length >= 3) {
      const contacts = cacheSearch.filter(ele =>JSON.stringify(ele).toLowerCase().includes(value));
      this.setState({contacts})
    } else {
      const contacts = [...this.state.cacheSearch];
      this.setState({contacts})
    }
  }

  render() {
    if (this.state.isLoading) {
      return <div>Loading...</div>;
    }

    if (this.state.error) {
      return <div>{this.state.error}</div>;
    }

    return (
      <div className="App">
        <header className="App-header">
          <h1>Contact Manager</h1>
        </header>
        <div style={{ margin: "20px 0" }}>
    <input 
       className="form-control" 
       onChange={this.searchContact} 
       placeholder="Search for contacts..."
    />
</div>

        <ContactTable contacts={this.state.contacts} onContactDeleted={this.handleContactDeleted} sortByName={this.handleSortByName} />
        
  <ContactData className="contact-form-container" openText='Add New Contact' edit={false} onContactChanged={this.handleContactDeleted} />

      </div>
    );
  }
}

export default App;
