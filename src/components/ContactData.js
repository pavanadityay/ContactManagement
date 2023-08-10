import React from 'react';
import ContactController from '../controllers/ContactController';
import axios from 'axios';




/*  This Component is responsible for Adding the data into our Table. */
class ContactData extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {
      fName: props.contact ? props.contact.fName : '',
      lName: props.contact ? props.contact.lName : '',
      email: props.contact ? props.contact.email : '',
      phone: props.contact ? props.contact.phone : '',
      imageUrl: props.contact ? props.contact.imageUrl : '',
      show: false,
      dataLoaded: true  // Set this to true by default
    };
  
    this.contacts = new ContactController();
  
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }
  

  /* This function handles Image Uploads. */
  async handleImageUpload(event) {
    const formData = new FormData();
    formData.append('contactImage', event.target.files[0]);
    
    try {
      const response = await axios.post('http://localhost:5000/api/contacts/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      this.setState({ imageUrl: 'http://localhost:5000/uploads/' + response.data });
      console.log("Heyy I am heree");
    } catch (error) {
      console.error("Error uploading the image:", error);
    }
  }
  
  
  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  /* This handles Form submit functionality. It will save changes to the layout. */
  handleSubmit(event) {

    
 
    const { fName, lName, email, phone, imageUrl } = this.state;
    let errorMessage = '';
    

    // FirstName & LastName Validation
    if (!fName || !lName || !/^[a-zA-Z]{1,50}$/.test(fName) || !/^[a-zA-Z]{1,50}$/.test(lName)) {
      errorMessage = 'Names can only contain alphabets and should be up to 50 characters.';
    }

    // Email Validation
    else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      errorMessage = 'Invalid email address.';
    }

    // PhoneNumber Validation
    else if (!/^\d{10}$/.test(phone)) {
      errorMessage = 'Phone number should be 10 digits.';
    }



    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    if(this.props.edit) {

      axios.put(`http://localhost:5000/api/contacts/${this.props.contact.id}`, {
        fName, lName, email, phone, imageUrl
      })
      .then(response => {
        console.log(response);
        this.props.onContactChanged(); // Refresh contacts in App.js
        this.hideModal()
      })
      .catch(error => {
        console.log(error);
      });
    } else {
      axios.post('http://localhost:5000/api/contacts', { fName, lName, email, phone, imageUrl })
      .then(response => {
        console.log(response);
        this.props.onContactChanged();// Refresh contacts in App.js
        this.hideModal();

      })
      .catch(error => {
        console.log(error);
      });


    }

    

    event.preventDefault();

  }

  showModal() {
    this.setState({ show: true });
  }

  hideModal() {
    this.setState({ show: false });
  }

  render() {
    if (!this.state.dataLoaded) {
      return <div>Loading...</div>;
    }

    let modal_title = this.props.edit ? 'Update Contact' : 'Add Contact';

    let modal = null;
if (this.state.show) {
  modal = (
    <div className='modal fade show'>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{modal_title}</h5>
            <button onClick={this.hideModal} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
          <form onSubmit={this.handleSubmit}>
      
            
            
            <div className="mb-3">
                <label className="form-label">
                First Name:
                </label>
                <input className="form-control" name='fName' type="text" value={this.state.fName} onChange={this.handleChange} />
              </div>
              <div>
                <label>
                Last Name:
                </label>
                <input className="form-control" name='lName' type="text" value={this.state.lName} onChange={this.handleChange} />
              </div>
              <div>
                <label>
                Email:
                </label>
                <input className="form-control" name='email' type="text" value={this.state.email} onChange={this.handleChange} />
              </div>
              <div>
                <label>
                Phone #:
                </label>
                <input className="form-control" name='phone' type="text" value={this.state.phone} onChange={this.handleChange} />
              </div>

              <div>
                <label>
                  Image Url:
                </label>
                
                <input type="file" onChange={this.handleImageUpload.bind(this)} />
                <input className="form-control" name='imageUrl' type="text" value={this.state.imageUrl} onChange={this.handleChange} readOnly />

              </div>



          </form>
          </div>
          <div className="modal-footer">
            <button onClick={this.hideModal} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button onClick={this.handleSubmit} type="button" className="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}

    return (
      <div>
        <button className='btn btn-primary' onClick={this.showModal}>{this.props.openText}</button>
        {modal}
      </div>
    );
  }
}

export default ContactData;
