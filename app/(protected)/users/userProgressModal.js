// app/users/UserProgressModal.js - VERSIÓN SIMPLE PARA PROBAR
"use client";

import React from 'react';
import { X } from 'lucide-react';

const UserProgressModal = ({ user, isOpen, onClose, supabase }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">
                        Progreso de {user?.name || 'Usuario'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">
                        📊 Modal de progreso funcionando correctamente
                    </p>
                    <p className="text-sm text-gray-500">
                        Usuario: {user?.email}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        ¡La importación funciona! 🎉
                    </p>
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserProgressModal;