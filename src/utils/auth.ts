// Sample user credentials for testing
export const sampleUsers = {
    doctor: {
      email: 'doctor@example.com',
      password: 'doc123',
    },
    patient: {
      email: 'patient@example.com',
      password: 'pat123',
    },
    lab: {
      email: 'lab@example.com',
      password: 'lab123',
    },
    pharmacy: {
      email: 'pharmacy@example.com',
      password: 'pharm123',
    },
  };
  
  export const validateUser = (email: string, password: string, role: string) => {
    const user = sampleUsers[role as keyof typeof sampleUsers];
    return user.email === email && user.password === password;
  };