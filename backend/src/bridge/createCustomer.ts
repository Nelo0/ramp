import bridgeDocs from '@api/bridge-docs';

export interface KycLinkInfo {
    fullName: string,
    email: string,
    userType: "individual" | "business"
    endorsements?: "sepa"
}

export const getKycLink = (userInfo: KycLinkInfo) => {
    const { fullName, email, userType, endorsements } = userInfo;

    const data = bridgeDocs.default.postKyc_links({
        full_name: fullName,
        email: email,
        type: userType,
        endorsements: endorsements ? ['sepa'] : undefined
    })
        .then(({ data }) => {
            console.log(data)
            return data;
        })
        .catch((err: Error) => {
            console.error(err)
            throw err;
        });

    return data
}