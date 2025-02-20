"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useSnackBar } from "@/components/context/SnackBarContext";
import { Button, Card, Grid, Input, Text } from "@nextui-org/react";

export default function Settings() {
    const router = useRouter();
    const { openSnackBar } = useSnackBar();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const currentPassword = formData.get("currentPassword");
        const newPassword = formData.get("newPassword");
        const confirmPassword = formData.get("confirmPassword");

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/user/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to change password");
            }

            openSnackBar("success", "Password updated successfully!");
            router.push("/surf-session");
        } catch (error) {
            setError("Failed to update password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] px-4 py-8">
            <Grid.Container gap={2} justify="center">
                <Grid xs={12} sm={6} md={4}>
                    <Card className="p-8 w-full">
                        <div className="px-4 py-6">
                            <Text h2 className="text-center my-6">
                                Change Password
                            </Text>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <Input.Password
                                    required
                                    fullWidth
                                    label="Current Password"
                                    name="currentPassword"
                                    placeholder="Enter your current password"
                                />
                                <Input.Password
                                    required
                                    fullWidth
                                    label="New Password"
                                    name="newPassword"
                                    placeholder="Enter your new password"
                                />
                                <Input.Password
                                    required
                                    fullWidth
                                    label="Confirm New Password"
                                    name="confirmPassword"
                                    placeholder="Confirm your new password"
                                />
                                {error && (
                                    <Text color="error" className="text-center">
                                        {error}
                                    </Text>
                                )}
                                <Button
                                    type="submit"
                                    color="primary"
                                    disabled={isLoading}
                                    className="mx-auto"
                                >
                                    {isLoading ? "Updating..." : "Update Password"}
                                </Button>
                            </form>
                        </div>
                    </Card>
                </Grid>
            </Grid.Container>
        </div>
    );
} 