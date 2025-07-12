
//     document.querySelector('.menu-toggle').addEventListener('click', function() {
//         document.querySelector('.head').classList.toggle('active');
//     });


    document.addEventListener('DOMContentLoaded', () => {
      const menuToggle = document.querySelector('.menu-toggle');
      const head = document.querySelector('.head');
  
      menuToggle.addEventListener('click', () => {
          head.classList.toggle('active');
      });
  });
  

    document.getElementById('logo1').addEventListener('click' , () =>{
        window.location.reload()
    }

)

document.getElementById('btn1').addEventListener('click', () =>{
    

        const inputs = document.querySelectorAll('#enroll input');
    
        // Check if any input is empty
        let isEmpty = false;
        inputs.forEach(function(input) {
            if (input.value.trim() === '') {  // Trim to ignore spaces
                isEmpty = true;
            }
        });
    
        if (isEmpty) {
            alert('Form is empty. Please fill in all fields.');
        } else {
            alert('Form submitted.');
        }
    })



// async function saveToCSV() {
//     const name = document.getElementById('name').value;
//     const email = document.getElementById('email').value;
//     const whatsapp = document.getElementById('whatsapp').value;

    

//     // const csvContent = `Name,Email,WhatsApp Number\n${name},${email},${whatsapp}\n`;

//     // const blob = new Blob([csvContent], { type: 'text/csv' });
//     // const url = window.URL.createObjectURL(blob);
//     // const a = document.createElement('a');
//     // a.setAttribute('href', url);
//     // a.setAttribute('download', 'data.csv');
//     // a.click();
// }

async function saveToCSV() {
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const whatsappField = document.getElementById('whatsapp');

    const name = nameField.value;
    const email = emailField.value;
    const whatsapp = whatsappField.value;

    if (!name || !email || !whatsapp) {
        alert('Please fill all fields');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/saveit', {  // Correct URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  // Ensure this matches what server expects
            },
            body: JSON.stringify({ name, email, whatsapp }),  // Ensure the body is in JSON format
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);  // Success message
            // Clear the form fields after successful submission
            nameField.value = '';
            emailField.value = '';
            whatsappField.value = '';
        } else {
            alert(result.error);  // Error message
        }
    } catch (error) {
        alert('Failed to save user data');
        console.error('Error:', error);
    }
}
