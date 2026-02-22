import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Update your profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <Input defaultValue="HR Manager" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input type="email" defaultValue="hr@company.com" className="mt-1" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Email Notifications</p>
                <p className="text-xs text-gray-500">Receive email updates</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Dark Mode</p>
                <p className="text-xs text-gray-500">Switch to dark theme</p>
              </div>
              <input type="checkbox" className="h-4 w-4" />
            </div>
            <Button variant="outline">Reset to Defaults</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>Manage API keys and endpoints</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">API Endpoint</label>
              <Input defaultValue="http://localhost:8000/api" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">API Key</label>
              <Input type="password" defaultValue="••••••••" className="mt-1" />
            </div>
            <Button variant="outline">Test Connection</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scoring Weights</CardTitle>
            <CardDescription>Adjust match score calculation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Experience Weight</label>
              <Input type="number" defaultValue="30" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Skills Weight</label>
              <Input type="number" defaultValue="50" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Education Weight</label>
              <Input type="number" defaultValue="20" className="mt-1" />
            </div>
            <Button>Update Weights</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
