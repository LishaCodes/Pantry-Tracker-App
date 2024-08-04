'use client';

import { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Alert } from '@mui/material';
import { auth, db } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import LoginPage from './LoginPage';

export default function PantryPage() {
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiry, setExpiry] = useState('');
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const itemsRef = collection(db, 'pantryItems');
      const q = query(itemsRef, where("userId", "==", user.uid));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const itemList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          console.log("Snapshot data:", snapshot.docs);
          console.log("Mapped itemList:", itemList);
          setItems(itemList);
        },
        (error) => {
          console.error("Error fetching items: ", error);
          setSnackbarMessage("Error fetching items.");
          setSnackbarOpen(true);
        }
      );
      return () => unsubscribe();
    }
  }, [user]);

  const handleAddItem = async () => {
    if (item.trim() && quantity.trim() && expiry.trim()) {
      try {
        if (user) {
          await addDoc(collection(db, 'pantryItems'), { name: item, quantity, expiry, userId: user.uid });
          console.log("Added item:", { name: item, quantity, expiry });
          setItem('');
          setQuantity('');
          setExpiry('');
          setDialogOpen(false);
          setSnackbarMessage("Item added successfully.");
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error("Error adding item: ", error.message);
        setSnackbarMessage("Error adding item: " + error.message);
        setSnackbarOpen(true);
      }
    } else {
      setSnackbarMessage("All fields are required.");
      setSnackbarOpen(true);
    }
  };

  const handleEditItem = async () => {
    if (item.trim() && quantity.trim() && expiry.trim() && editingItem) {
      try {
        await updateDoc(doc(db, 'pantryItems', editingItem.id), { name: item, quantity, expiry });
        console.log("Updated item:", { id: editingItem.id, name: item, quantity, expiry });
        setItem('');
        setQuantity('');
        setExpiry('');
        setEditingItem(null);
        setDialogOpen(false);
        setSnackbarMessage("Item updated successfully.");
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Error updating item: ", error.message);
        setSnackbarMessage("Error updating item: " + error.message);
        setSnackbarOpen(true);
      }
    } else {
      setSnackbarMessage("All fields are required.");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, 'pantryItems', id));
      console.log("Deleted item with ID:", id);
      setSnackbarMessage("Item deleted successfully.");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting item: ", error.message);
      setSnackbarMessage("Error deleting item: " + error.message);
      setSnackbarOpen(true);
    }
  };

  const handleOpenDialog = (item = null) => {
    if (item) {
      setItem(item.name);
      setQuantity(item.quantity);
      setExpiry(item.expiry);
      setEditingItem(item);
    } else {
      setItem('');
      setQuantity('');
      setExpiry('');
      setEditingItem(null);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setItem('');
    setQuantity('');
    setExpiry('');
    setEditingItem(null);
  };

  const handleLogout = () => {
    auth.signOut().catch((error) => {
      console.error("Error signing out: ", error.message);
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (!user) {
    return <LoginPage />;
  }

  return (
    <Container
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 0,
        minHeight: '100vh',
        position: 'relative',
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // White background for the page
        color: '#fff', // White text color for overall page
      }}
    >
      <div style={{ 
        position: 'absolute', 
        top: '10px', 
        right: '10px' 
      }}>
        <Button 
          onClick={handleLogout} 
          variant="contained" 
          style={{ 
            backgroundColor: '#1E90FF', // Darker blue background
            color: '#fff',
            marginBottom: '20px'
          }}
        >
          Logout
        </Button>
      </div>
      <Typography
        variant="h1"
        style={{
          color: '#000', // Black color for heading
          marginBottom: '1rem',
          textAlign: 'center',
          fontSize: '3rem',
          fontWeight: 'bold',
          marginTop: '2rem',
        }}
      >
        Pantry Tracker
      </Typography>
      <Button 
        onClick={() => handleOpenDialog()} 
        variant="contained" 
        style={{ 
          backgroundColor: '#1E90FF', // Darker blue background
          color: '#fff',
          marginBottom: '20px'
        }}
      >
        Add Item
      </Button>
      <TableContainer component={Paper} style={{ 
        marginBottom: '20px', 
        width: '80%', 
        backgroundColor: '#fff' // White background for table
      }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: '#000', fontWeight: 'bold' }}>Item Name</TableCell>
              <TableCell style={{ color: '#000', fontWeight: 'bold' }}>Quantity</TableCell>
              <TableCell style={{ color: '#000', fontWeight: 'bold' }}>Expiry Date</TableCell>
              <TableCell style={{ color: '#000', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length > 0 ? (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell style={{ color: '#000' }}>{item.name}</TableCell>
                  <TableCell style={{ color: '#000' }}>{item.quantity}</TableCell>
                  <TableCell style={{ color: '#000' }}>{item.expiry}</TableCell>
                  <TableCell>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleOpenDialog(item)}>
                      <EditIcon style={{ color: '#000' }} />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteItem(item.id)}>
                      <DeleteIcon style={{ color: '#000' }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} style={{ textAlign: 'center', color: '#000' }}>
                  No items found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarMessage.includes("Error") ? "error" : "success"}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle style={{ color: '#000' }}>{editingItem ? 'Edit Item' : 'Add Item'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Item Name"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            InputProps={{
              style: {
                color: '#000' // Black text color in input
              }
            }}
          />
          <TextField
            label="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            InputProps={{
              style: {
                color: '#000' // Black text color in input
              }
            }}
          />
          <TextField
            label="Expiry Date"
            type="date"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            InputLabelProps={{
              shrink: true
            }}
            InputProps={{
              style: {
                color: '#000' // Black text color in input
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} style={{ color: '#1E90FF' }}>Cancel</Button>
          <Button onClick={editingItem ? handleEditItem : handleAddItem} style={{ color: '#1E90FF' }}>
            {editingItem ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
