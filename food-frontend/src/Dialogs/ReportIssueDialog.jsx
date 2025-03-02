import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";

const ReportIssueDialog = ({ open, onClose }) => {
  const [reportText, setReportText] = useState("");

  const handleSubmit = () => {
    if (reportText.trim() === "") {
      alert("Please enter a description of the issue.");
      return;
    }
    console.log("Issue Reported:", reportText);
    alert("Your issue has been reported successfully.");
    setReportText("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <div className="flex items-center gap-2">
          <ReportProblemIcon className="text-red-500" />
          Report an Issue
        </div>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          If you're facing an issue with your order, please describe it below:
        </Typography>
        <textarea
          className="w-full mt-4 p-2 border border-gray-300 rounded-md"
          placeholder="Describe the issue..."
          rows="4"
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="error" variant="contained">
          Submit Report
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportIssueDialog;
