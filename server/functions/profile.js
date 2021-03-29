module.exports = () => ({
    sortProfileData: (profileData) => {
        let userProfileData = [
            'userAvatar',
            'userName',
            'userNickName',
            'userEmail',
            'userCity',
            'userAge',
            'userDescription',
            'gender'
        ];

        let sortingProfileData = {};

        userProfileData.forEach((keyName) => {
            sortingProfileData[keyName] = profileData[keyName] || null;
        });

        return sortingProfileData;
    }
});