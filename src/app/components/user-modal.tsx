import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";

interface Props {
    open: boolean;
    onClose: () => void;
    newUser: { firstName: string; lastName: string; email: string; password: string; phone: string; points: string };
    handleChangeNewUser: (field: string, value: string) => void;
    handleSubmitUser: () => void;
}

export default function UserModal({
    open,
    onClose,
    newUser,
    handleChangeNewUser,
    handleSubmitUser,
}: Props) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Create User</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="First Name"
                    value={newUser.firstName}
                    onChange={(e) => handleChangeNewUser("firstName", e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Last Name"
                    value={newUser.lastName}
                    onChange={(e) => handleChangeNewUser("lastName", e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Email"
                    value={newUser.email}
                    onChange={(e) => handleChangeNewUser("email", e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Phone"
                    value={newUser.phone}
                    onChange={(e) => handleChangeNewUser("phone", e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => handleChangeNewUser("password", e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Points"
                    type="number"
                    value={newUser.points}
                    onChange={(e) => handleChangeNewUser("points", e.target.value)}
                    sx={{ mb: 2 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmitUser}>Create</Button>
            </DialogActions>
        </Dialog>
    );
}
