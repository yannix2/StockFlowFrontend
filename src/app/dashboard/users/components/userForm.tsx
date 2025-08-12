'use client';

import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, XCircle, Crown, Shield, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from 'antd';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import { Input } from 'antd';
interface UserData {
  id?: number;
  name: string;
  familyName: string;
  email: string;    
  cin: string;
  phoneNumber?: string;
  address?: string;
  role: 'admin' | 'manager' | 'user';
  password?: string;
}

interface UserFormProps {
  initialValues?: UserData;
  onSuccess: () => void;
  onCancel: () => void;
  isEditMode: boolean;
}

const roleOptions = [
  { value: 'admin', label: 'Admin', icon: <Crown size={16} /> },
  { value: 'manager', label: 'Manager', icon: <Shield size={16} /> },
  { value: 'user', label: 'User', icon: <User size={16} /> }
];
// FormFields takes form prop
const FormFields = ({ form }: { form: any }) => (
  <>
    <div className="grid grid-cols-2 gap-4">
      <Form.Item
        name="name"
        label={<span className="text-gray-300 font-semibold">First Name</span>}
        rules={[{ required: true, message: 'Please input first name!' }]}
      >
        <Input
          placeholder="John"
          prefix={<User className="text-gray-400 mr-2" />}
          className="bg-yellow-900 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-400 transition pl-10"
        />
      </Form.Item>

      <Form.Item
        name="familyName"
        label={<span className="text-gray-300 font-semibold">Last Name</span>}
        rules={[{ required: true, message: 'Please input last name!' }]}
      >
        <Input
          placeholder="Doe"
          className="bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-400 transition"
        />
      </Form.Item>
    </div>

    <Form.Item
      name="email"
      label={<span className="text-gray-300 font-semibold">Email</span>}
      rules={[
        { required: true, message: 'Please input email!' },
        { type: 'email', message: 'Please enter a valid email!' }
      ]}
    >
      <Input
        type="email"
        placeholder="user@example.com"
        prefix={<Mail className="text-gray-400 mr-2" />}
        className="bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-400 transition pl-10"
      />
    </Form.Item>

    <Form.Item
      name="cin"
      label={<span className="text-gray-300 font-semibold">CIN</span>}
      rules={[{ required: true, message: 'Please input CIN!' }]}
    >
      <Input
        placeholder="12345678"
        className="bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-400 transition"
      />
    </Form.Item>

    <div className="grid grid-cols-2 gap-4">
      <Form.Item
        name="phoneNumber"
        label={<span className="text-gray-300 font-semibold">Phone Number</span>}
      >
        <Input
          placeholder="+216 12 345 678"
          className="bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-400 transition"
        />
      </Form.Item>

      <Form.Item
        name="address"
        label={<span className="text-gray-300 font-semibold">Address</span>}
      >
        <Input
          placeholder="City, Country"
          className="bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-400 transition"
        />
      </Form.Item>
    </div>

    {/* ROLE SELECT - no render functions! */}
    <Form.Item
      name="role"
      label={<span className="text-gray-300 font-semibold">Role</span>}
      rules={[{ required: true, message: 'Please select role!' }]}
    >
      {/* Controlled by Form automatically */}
      <Select onValueChange={(value: string) => form.setFieldsValue({ role: value })} placeholder="Select role" >
        <SelectTrigger className="bg-gray-900 border border-gray-700 text-white hover:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border border-gray-700">
          {roleOptions.map(role => (
            <SelectItem
              key={role.value}
              value={role.value}
              className="hover:bg-gray-700 focus:bg-gray-700"
            >
              <div className="flex items-center gap-2">
                {role.icon}
                <span className="text-white">{role.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Form.Item>
  </>
);

const AddUserForm = ({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) => {
  const [form] = Form.useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidations, setPasswordValidations] = useState({
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
    hasLength: false,
    matches: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cookies] = useCookies(['refreshToken']);

  // Initialize form values including role to empty string to avoid uncontrolled warning
  useEffect(() => {
    form.setFieldsValue({
      role: ''
    });
  }, [form]);

    const handlePasswordChange = (e:    React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setFieldsValue({ password: value });


    const validations = {
      hasUpper: /[A-Z]/.test(value),
      hasLower: /[a-z]/.test(value),
      hasNumber: /[0-9]/.test(value),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      hasLength: value.length >= 8,
      matches: value === form.getFieldValue('confirmPassword') && value !== ''
    };
    setPasswordValidations(validations);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setFieldsValue({ confirmPassword: value });

    setPasswordValidations(prev => ({
      ...prev,
      matches: value === form.getFieldValue('password') && value !== ''
    }));
  };

  const handleSubmit = async (values: any) => {
  setIsSubmitting(true);

  if (!passwordValidations.hasUpper || !passwordValidations.hasLower || 
      !passwordValidations.hasNumber || !passwordValidations.hasSpecial || 
      !passwordValidations.hasLength) {
    
    let errorMsg = 'Password must contain:';
    if (!passwordValidations.hasUpper) errorMsg += '\n- At least one uppercase letter';
    if (!passwordValidations.hasLower) errorMsg += '\n- At least one lowercase letter';
    if (!passwordValidations.hasNumber) errorMsg += '\n- At least one number';
    if (!passwordValidations.hasSpecial) errorMsg += '\n- At least one special character';
    if (!passwordValidations.hasLength) errorMsg += '\n- At least 8 characters';
    
    toast.error(errorMsg);
    setIsSubmitting(false);
    return;
  }
    try {
      const response = await fetch('https://stockflowbackend-2j27.onrender.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookies.refreshToken}`
        },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
      }

      toast.success('User created successfully');
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit} className="space-y-6" initialValues={{ role: '' }}>
      <FormFields form={form} />

     <Form.Item
  name="password"
  label={<span className="text-gray-300 font-semibold">Password</span>}
  rules={[/* your rules */]}
>
  <Input.Password
    placeholder="Create password"
    onChange={handlePasswordChange}
    className="bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-400 transition"
  />
</Form.Item>
      <Form.Item
        name="confirmPassword"
        label={<span className="text-gray-300 font-semibold">Confirm Password</span>}
        dependencies={['password']}
        rules={[
          { required: true, message: 'Please confirm password!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) return Promise.resolve();
              return Promise.reject(new Error('Passwords do not match!'));
            }
          })
        ]}
      >
        <div className="relative">
          <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm password"
            className="pl-10 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-400 transition"
            onChange={handleConfirmPasswordChange}
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-400 hover:text-yellow-400 focus:outline-none"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </Form.Item>

      <div className="flex justify-end gap-4 pt-4">
        <Button
          variant="outline"
          onClick={onCancel}
          className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-yellow-400 transition"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold shadow-lg shadow-yellow-500/50 transition"
        >
          {isSubmitting ? 'Creating...' : 'Create User'}
        </Button>
      </div>
    </Form>
  );
};

const EditUserForm = ({
  initialValues,
  onSuccess,
  onCancel
}: {
  initialValues?: UserData;
  onSuccess: () => void;
  onCancel: () => void;
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cookies] = useCookies(['refreshToken']);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        role: initialValues.role ?? '',
        password: '',
        confirmPassword: ''
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      const body = { ...values };
      if (!body.password) {
        delete body.password;
      }
      if ('confirmPassword' in body) {
        delete body.confirmPassword;
      }
      const response = await fetch(`https://stockflowbackend-2j27.onrender.com/users/${initialValues?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookies.refreshToken}`
        },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }
      toast.success('User updated successfully');
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update user');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit} className="space-y-6" initialValues={{ role: '' }}>
      <FormFields form={form} />

      <Form.Item
        name="password"
        label={<span className="text-gray-300 font-semibold">Password (leave blank to keep unchanged)</span>}
        hasFeedback
        rules={[
          {
            validator: (_, value) => {
              if (!value) return Promise.resolve();
              const isValid =
                /[A-Z]/.test(value) &&
                /[a-z]/.test(value) &&
                /[0-9]/.test(value) &&
                /[!@#$%^&*(),.?":{}|<>]/.test(value) &&
                value.length >= 8;
              return isValid ? Promise.resolve() : Promise.reject(new Error('Password does not meet requirements'));
            }
          }
        ]}
      >
        <Input.Password
          placeholder="New password (optional)"
          className="bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-400 transition"
        />
      </Form.Item>

      {/* No confirm password field for edit */}

      <div className="flex justify-end gap-4 pt-4">
        <Button
          variant="outline"
          onClick={onCancel}
          className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-yellow-400 transition"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold shadow-lg shadow-yellow-500/50 transition"
        >
          {isSubmitting ? 'Updating...' : 'Update User'}
        </Button>
      </div>
    </Form>
  );
};

export const UserForm = (props: UserFormProps) => {
  const { isEditMode, initialValues, onSuccess, onCancel } = props;

  return (
    <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
      <h2 className="text-yellow-400 text-2xl font-bold mb-6">{isEditMode ? 'Edit User' : 'Add User'}</h2>

      {isEditMode ? (
        <EditUserForm initialValues={initialValues} onSuccess={onSuccess} onCancel={onCancel} />
      ) : (
        <AddUserForm onSuccess={onSuccess} onCancel={onCancel} />
      )}
    </div>
  );
};

export default UserForm;
