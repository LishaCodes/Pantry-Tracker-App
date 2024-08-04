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
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div style={{ display: 'flex', marginBottom: '20px', width: '80%', justifyContent: 'space-between' }}>
        <TextField
          label="Search Pantry"
          value={searchQuery}
          onChange={handleSearchChange}
          variant="outlined"
          style={{ flex: 1, marginRight: '10px' }}
          InputProps={{
            style: {
              color: '#000' // Black text color in input
            }
          }}
        />
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
      </div>
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
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
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
                  No items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{editingItem ? 'Edit Item' : 'Add Item'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Item Name"
            type="text"
            fullWidth
            value={item}
            onChange={(e) => setItem(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Quantity"
            type="text"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Expiry Date"
            type="date"
            fullWidth
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={editingItem ? handleEditItem : handleAddItem} color="primary">
            {editingItem ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
