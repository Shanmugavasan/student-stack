import React from 'react';
import StudentBlogs from '../components/StudentBlogs';
import QnaForum from '../components/QnaForum';

export default function CommunityPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <StudentBlogs />
      <QnaForum />
    </div>
  );
}