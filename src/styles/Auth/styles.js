import { StyleSheet } from "react-native";

export default StyleSheet.create({
    logoLoginContainer: {
        flexDirection: "row",
        justifyContent: "center"
    },
    logo: {
        width: 160,
        height: 160,
        borderRadius: 100
    },
    changeLogo: {
        position: 'absolute', bottom: 0, right: '30%',
        backgroundColor: 'powderblue', width: 40, height: 40, borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginTextContainer: {
        marginTop: 30,
    },
    loginText: {
        textAlign: "center",
        fontSize: 30,
        fontWeight: "bold",
        color: "#232836",
    },
    wrapInputContainer: {
        marginVertical: 10,
    },
    inputContainer: {
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        borderRadius: 20,
        elevation: 10,
        alignItems: "center",
        height: 50,
        marginVertical: 14
    },
    inputIcon: {
        marginLeft: 15,
        marginRight: 5,
    },
    textInput: {
        flex: 1,
        marginRight: 10,
    },
    textLinkContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    forgotPasswordText: {
        color: "#0171d3",
        fontSize: 12,
    },
    loginWithPasswordText: {
        color: "#0171d3",
        fontSize: 12,
    },
    loginWithSMSText: {
        color: "#0171d3",
        fontSize: 12,
    },
    loginButtonContainer: {
        marginVertical: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "#016dcb",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20
    },
    loginButtonText: {
        fontSize: 20,
        fontWeight: "400",
        color: "#fff"
    },
    textLinkSignupContainer: {
        flexDirection: "row",
        justifyContent: "center"
    },
    socialMediaContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center"
    },
    socialIcon: {
        backgroundColor: "white",
        marginHorizontal: 10,
        borderRadius: 50,
        padding: 10,
        elevation: 10,
    }
});