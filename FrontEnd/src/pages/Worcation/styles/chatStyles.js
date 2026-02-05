export const chatStyles = {
  container: {
    height: '100vh',
    position: 'relative',
    backgroundColor: '#f5f5f5',
  },
  sidebar: {
    borderRight: '1px solid #e0e0e0',
    backgroundColor: '#ffffff',
    width: '300px',
  },
  chatHeader: {
    padding: '15px',
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: '#ffffff',
  },
  chatTitle: {
    margin: 0,
    color: '#FFD700',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  messageInput: {
    borderTop: '1px solid #e0e0e0',
    padding: '15px',
    backgroundColor: '#ffffff',
  },
  messageBubble: {
    sent: {
      backgroundColor: '#FFD700',
      color: '#000000',
      borderRadius: '15px 15px 0 15px',
      padding: '10px 15px',
      margin: '5px 0',
      maxWidth: '70%',
      alignSelf: 'flex-end',
    },
    received: {
      backgroundColor: '#f0f0f0',
      color: '#333333',
      borderRadius: '15px 15px 15px 0',
      padding: '10px 15px',
      margin: '5px 0',
      maxWidth: '70%',
    },
  },
  emptyState: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    flexDirection: 'column',
    color: '#666',
    textAlign: 'center',
    padding: '20px',
  },
  searchInput: {
    width: '100%',
    padding: '10px 15px',
    border: '1px solid #e0e0e0',
    borderRadius: '20px',
    outline: 'none',
    '&:focus': {
      borderColor: '#FFD700',
    },
  },
  chatItem: {
    '&:hover': {
      backgroundColor: '#fff9c4',
      cursor: 'pointer',
    },
    '&.active': {
      backgroundColor: '#fff9c4',
      borderLeft: '3px solid #FFD700',
    },
  },
};
