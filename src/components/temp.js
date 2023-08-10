fetchContacts = () => {
  axios.get('http://localhost:5000/api/contacts')
    .then(response => {
      const contacts = response.data;
      this.setState({ contacts, isLoading: false });
    })
    .catch(error => {
      console.error("Error fetching data:", error);
      this.setState({ error: "Error fetching data.", isLoading: false });
    });
}

handleContactChanged = () => {
  this.fetchContacts();
}

// Render method:
<ContactData openText='Add New Contact' edit={false} onContactChanged={this.handleContactChanged} />
