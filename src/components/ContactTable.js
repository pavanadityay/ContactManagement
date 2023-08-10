import React from 'react';
import ContactRow from "./ContactRow";

/* This class has all the headers for our Table and also It populates the data coming from the ContactRow */
class ContactTable extends React.Component {
  render() {
    return (

      <div className="contact-table-wrapper">
    <button className="sortByName btn-sort" onClick={this.props.sortByName}>Sort By Name</button>
    <table className='table contact-table'>
        <thead>
          <tr className="contact-row">
            <th>Image</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone #</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {this.props.contacts.map((contact, i) => {                
            return (
              <ContactRow 
                key={contact.id} 
                contact={contact} 
                onContactDeleted={this.props.onContactDeleted}
              />
            )
          })}
        </tbody>
    </table>
</div>

    
    );
  }
}

export default ContactTable;
