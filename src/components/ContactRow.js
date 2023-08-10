import React from 'react';
import UpdateOrDelete from "./UpdateOrDelete";

/* This class handles each row of our Contact Data. Seperated it for the better readability and understanding */
class ContactRow extends React.Component {
  render() {
    const { id, imageUrl, fName, lName, email, phone } = this.props.contact;
    
    return (
      <tr data-key={id} className="contact-row">
        <td><img alt={`${fName} ${lName} Profile`} className='thumbnail' src={imageUrl}/></td>
        <td>{fName}</td>
        <td>{lName}</td>
        <td>{email}</td>
        <td>{phone}</td>
        <td>
          {/* Passing the onContactDeleted function to UpdateOrDelete */}
          <UpdateOrDelete contact={this.props.contact} onContactDeleted={this.props.onContactDeleted} />
        </td>
      </tr>
    );
  }
}

export default ContactRow;
