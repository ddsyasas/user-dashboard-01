'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, Button, Input } from '@nextui-org/react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ImageCropper from '@/components/ImageCropper';

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: string; content: string }>({ type: '', content: '' });

  // Profile update states
  const [name, setName] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');

  // Email update states
  const [newEmail, setNewEmail] = useState('');

  // Password update states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Avatar update states
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fetch current user data
  useEffect(() => {
    async function fetchUserData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentEmail(user.email || '');
          
          // Fetch profile data
          const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', user.id);
          
          if (profileError) {
            console.error('Error fetching profile:', profileError);
            return;
          }

          if (profiles && profiles.length > 0) {
            setName(profiles[0].full_name || '');
            setAvatarUrl(profiles[0].avatar_url);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchUserData();
  }, []);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', content: 'Please upload an image file.' });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', content: 'Image size should be less than 2MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    try {
      setUploading(true);
      setShowCropper(false);
      setMessage({ type: '', content: '' });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Upload cropped image to Supabase storage
      const fileName = `${user.id}-${Math.random()}.jpg`;
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, croppedBlob);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        });

      if (updateError) {
        throw updateError;
      }

      setAvatarUrl(publicUrl);
      setMessage({ type: 'success', content: 'Profile picture updated successfully!' });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setMessage({ type: 'error', content: 'Error uploading profile picture. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setSelectedImage(null);
  };

  // Handle all updates
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', content: '' });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      let updates = [];

      // Update name if changed
      if (name) {
        // First check if profile exists
        const { data: profiles, error: checkError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id);

        if (checkError) {
          console.error('Error checking profile:', checkError);
          throw checkError;
        }

        if (!profiles || profiles.length === 0) {
          // Create profile if it doesn't exist
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([{ 
              id: user.id, 
              full_name: name 
            }]);

          if (insertError) {
            console.error('Error creating profile:', insertError);
            throw insertError;
          }
        } else {
          // Update existing profile
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ full_name: name })
            .eq('id', user.id);

          if (updateError) {
            console.error('Error updating profile:', updateError);
            throw updateError;
          }
        }
        updates.push('profile');
      }

      // Update email if changed
      if (newEmail && currentEmail !== newEmail) {
        const { error: emailError } = await supabase.auth.updateUser({ email: newEmail });
        if (emailError) throw emailError;
        updates.push('email');
      }

      // Update password if changed
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          throw new Error('New passwords do not match');
        }
        const { error: passwordError } = await supabase.auth.updateUser({ password: newPassword });
        if (passwordError) throw passwordError;
        updates.push('password');
      }

      setMessage({
        type: 'success',
        content: `Updated successfully: ${updates.join(', ')}`
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setMessage({
        type: 'error',
        content: error.message || 'Error updating profile. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      
      {/* Profile Picture Section */}
      <Card className="mb-8">
        <CardBody>
          <h3 className="text-lg font-semibold mb-4">Profile Picture</h3>
          <div className="flex items-center space-x-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
            </div>
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                disabled={uploading}
                className="mb-2"
              />
              <p className="text-sm text-gray-500">
                Supported formats: JPG, PNG, GIF (max 2MB)
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {selectedImage && (
        <ImageCropper
          imageSrc={selectedImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          open={showCropper}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Settings */}
        <Card>
          <CardBody className="space-y-4">
            <div>
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
          </CardBody>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardBody className="space-y-4">
            <div>
              <Input
                label="Current Email"
                value={currentEmail}
                isReadOnly
                type="email"
              />
            </div>
            <div>
              <Input
                label="New Email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                type="email"
                placeholder="Enter new email"
              />
            </div>
          </CardBody>
        </Card>

        {/* Password Settings */}
        <Card>
          <CardBody className="space-y-4">
            <div>
              <Input
                label="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                type="password"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <Input
                label="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                type="password"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <Input
                label="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                placeholder="Confirm new password"
              />
            </div>
          </CardBody>
        </Card>

        {message.content && (
          <div className={`p-4 rounded-lg ${
            message.type === 'error' ? 'bg-danger-50 text-danger-600' : 'bg-success-50 text-success-600'
          }`}>
            {message.content}
          </div>
        )}

        <div className="flex justify-end">
          <Button
            color="primary"
            type="submit"
            isLoading={loading}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
} 