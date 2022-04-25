import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signedIn: false,
  uid: "",
  email: "",
  firstName: "",
  lastName: "",
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setUser(state, action) {
      const { uid, email, firstName, lastName } = action.payload;
      state.signedIn = true;
      state.uid = uid ? uid : state.uid;
      state.email = email ? email : state.email;
      state.firstName = firstName ? firstName : state.firstName;
      state.lastName = lastName ? lastName : state.lastName;
    },
    signOut(state, action) {
      Object.assign(state, initialState);
    },
  },
});

export const { setUser, signOut, updateBalance, updatePayPalEmail } =
  accountSlice.actions;

export default accountSlice.reducer;
