function ProfileCard({ user }) {
    return (
        <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">
                👤 Profile
            </h2>

            <div className="space-y-4">
                <div>
                    <p className="text-gray-500">
                        Name
                    </p>

                    <p className="font-semibold text-lg">
                        {user.name}
                    </p>
                </div>

                <div>
                    <p className="text-gray-500">
                        Email
                    </p>
                    <p className="font-semibold">
                        {user.email}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ProfileCard;