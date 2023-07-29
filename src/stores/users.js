import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { supabase } from "../supabase";

export const useUserStore = defineStore("users", () => {
  const user = ref(null);
  const errorMsg = ref("");
  const loading = ref(false);
  const loadingUser = ref(false);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleLogin = async (credentials) => {
    const { email, password } = credentials;

    if (!password.length) {
      return (errorMsg.value = "Password can not be empty");
    }
    if (!validateEmail(email)) {
      return (errorMsg.value = "email is not valid");
    }

    loading.value = true;

    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      loading.value = false;
      return (errorMsg.value = error);
    }

    const { data: existingUser } = await supabase
      .from("users")
      .select()
      .eq("email", email)
      .single();

    user.value = {
      email: existingUser.email,
      id: existingUser.id,
      username: existingUser.username,
    };
    loading.value = false;
    errorMsg.value = "";
  };

  const handleSignup = async (credentials) => {
    const { email, password, username } = credentials;
    if (password.length < 6) {
      return (errorMsg.value = "Password length is too short");
    }
    if (username.length < 4) {
      return (errorMsg.value = "UserName length is too short");
    }

    if (!validateEmail(email)) {
      return (errorMsg.value = "email is not valid");
    }

    //Validate if the user exists

    loading.value = true;

    const { data: userWithUsername } = await supabase
      .from("users")
      .select()
      .eq("username", username)
      .single();

    if (userWithUsername) {
      loading.value = false;
      return (errorMsg.value = "Username already taken");
    }

    errorMsg.value = "";
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      loading.value = false;
      return (errorMsg.value = error);
    }
    console.log("above inserting user");
    await supabase.from("users").insert({
      username,
      email,
    });
    console.log("below inserting user");
    const { data: newUser } = await supabase
      .from("users")
      .select()
      .eq("email", email)
      .single();

    user.value = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
    };

    loading.value = false;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    user.value = null;
  };

  const getUser = async () => {
    loadingUser.value = true;
    const { data, error } = await supabase.auth.getUser();

    if (!data.user) {
      loadingUser.value = false;
      return (user.value = null);
    }

    const { data: userWithEmail } = await supabase
      .from("users")
      .select()
      .eq("email", data.user.email)
      .single();

    user.value = {
      email: userWithEmail.email,
      username: userWithEmail.username,
      id: userWithEmail.id,
    };

    loadingUser.value = false;
  };

  const clearErrorMsg = () => {
    errorMsg.value = "";
  };

  return {
    user,
    errorMsg,
    loading,
    user,
    loadingUser,
    handleLogin,
    handleSignup,
    handleLogout,
    getUser,
    clearErrorMsg,
  };
});
