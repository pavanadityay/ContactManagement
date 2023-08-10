import React from 'react';
import ContactData from "./ContactData";
import ContactController from '../controllers/ContactController';
import axios from 'axios';

/* This has Update or delete buttons to edit or delete the data */
class UpdateOrDelete extends React.Component {

  componentDidMount() {
    this.setState({});
  }


  deleteContact = async () => {
    await axios.delete(`http://localhost:5000/api/contacts/${this.props.contact.id}`);
    // Here we inform the App component to refresh the contact list
    this.props.onContactDeleted();
  }


  render() {
    return (
      <div>
      <ContactData openText='update' contact={this.props.contact} edit={true} onContactChanged={this.props.onContactDeleted}/>
      <button className='btn btn-danger' onClick={this.deleteContact}>Delete</button>
    </div>
    );
  }
}

export default UpdateOrDelete;