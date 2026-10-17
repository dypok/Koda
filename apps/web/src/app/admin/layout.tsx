'use client';

import React, { useState, useEffect } from 'react';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminTopHud } from '@/components/admin/AdminTopHud';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AddSelectorModal } from '@/components/admin/AddSelectorModal';
import { DeleteSelectorModal } from '@/components/admin/DeleteSelectorModal';
import { useAdminCurriculumStore } from '@/stores/admin-curriculum.store';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { initCurriculum } = useAdminCurriculumStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    initCurriculum();
  }, [initCurriculum]);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-amber-500/30 selection:text-amber-200 overflow-hidden">
        {/* Barra superior de control táctico */}
        <AdminTopHud />

        {/* Cuerpo principal con Sidebar y Workspace */}
        <div className="flex-1 flex overflow-hidden relative">
          <AdminSidebar
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onOpenDeleteModal={() => setIsDeleteModalOpen(true)}
          />

          <main className="flex-1 flex flex-col overflow-y-auto relative bg-slate-950">
            {children}
          </main>
        </div>

        {/* Modales globales de alta y baja */}
        <AddSelectorModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
        <DeleteSelectorModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} />
      </div>
    </AdminGuard>
  );
}
