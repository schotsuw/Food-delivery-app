import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography, Box } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";

const MessageDialog = ({ open, onClose, riderName }) => {
  const [messages, setMessages] = useState([
    { text: `Hey! I'm on my way with your order.`, sender: "rider" }
  ]);
  const [messageText, setMessageText] = useState("");

  const handleSendMessage = () => {
    if (messageText.trim() === "") return;

    setMessages([...messages, { text: messageText, sender: "client" }]);
    setMessageText("");

    // Simulate a rider's auto-response after a delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "Got it! See you soon. 🚴‍♂️", sender: "rider" }
      ]);
    }, 1500);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Chat with {riderName}
        <Button onClick={onClose} style={{ float: "right" }}>
          <CloseIcon />
        </Button>
      </DialogTitle>
      <DialogContent>
        {/* Chat Messages */}
        <Box sx={{ maxHeight: "300px", overflowY: "auto", padding: "10px" }}>
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: msg.sender === "client" ? "flex-end" : "flex-start",
                mb: 1,
              }}
            >
              <Typography
                sx={{
                  backgroundColor: msg.sender === "client" ? "#FF3A2F" : "#E0E0E0",
                  color: msg.sender === "client" ? "white" : "black",
                  borderRadius: "10px",
                  padding: "8px 12px",
                  maxWidth: "75%",
                }}
              >
                {msg.text}
              </Typography>
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <Button onClick={handleSendMessage} variant="contained" color="primary">
          <SendIcon />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MessageDialog;
