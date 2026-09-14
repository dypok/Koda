# ⚙️ Dominio 4 — Arquitectura & Backend

> **Diseño de sistemas, arquitectura de persistencia híbrida, transporte híbrido GraphQL y REST, pipeline de certificación y administración de Koda 🦊.**

---

## 📑 Documentos del Dominio

| Documento | Título | Propósito Principal |
|---|---|---|
| [**11_SYSTEM_ARCHITECTURE.md**](11_SYSTEM_ARCHITECTURE.md) | Arquitectura del Sistema | Monolito modular en NestJS (`ADR-008`), 9 motores de dominio desacoplados, flujo de datos y escalabilidad. |
| [**12_DATABASE_DESIGN.md**](12_DATABASE_DESIGN.md) | Diseño de Base de Datos | Persistencia híbrida políglota (`ADR-009`): Supabase (PostgreSQL 15+) transaccional + MongoDB para contenido. |
| [**13_API_SPECIFICATION.md**](13_API_SPECIFICATION.md) | Especificación de API (REST & GraphQL) | Contratos OpenAPI 3.0.3, límites híbridos con GraphQL (`ADR-012`), autenticación JWT stateless y endpoints. |
| [**17_CERTIFICATION.md**](17_CERTIFICATION.md) | Pipeline de Certificación | Emisión de diplomas en backend con código correlativo `CQ-*`, código QR ISO 18004 y Google Drive API v3 (`ADR-003`). |
| [**25_ADMIN_SYSTEM.md**](25_ADMIN_SYSTEM.md) | Sistema de Administración | Consola de administración, gestión RBAC (USER vs. ADMIN), auditoría de cambios y publicación sin despliegue. |
| [**COMPARATIVA_ARQUITECTURA_MODULAR_VS_HEXAGONAL_EDD.md**](COMPARATIVA_ARQUITECTURA_MODULAR_VS_HEXAGONAL_EDD.md) | Comparativa de Arquitectura Backend | Estudio comparativo y veredicto: Arquitectura Modular Nativa de NestJS vs. Monolito Hexagonal basado en EDD. |

---

## 🏛️ Registros de Decisiones de Arquitectura (ADRs)
Las decisiones técnicas estructurales de este dominio están formalizadas en la subcarpeta [`adr/`](../adr/README.md):
- **ADR-001:** Monorepo con PNPM Workspaces
- **ADR-002:** Persistencia Relacional con Supabase (PostgreSQL 15+)
- **ADR-003:** Pipeline de Certificación en Backend y Storage en Google Drive API v3
- **ADR-004:** Renderizado WebGL de Mascota Koda con PixiJS v7
- **ADR-005:** Adopción de Python 3.12 como Lenguaje Oficial del MVP
- **ADR-006:** Motor de Ejecución de Código Híbrido (`ICodeRunner`)
- **ADR-007:** Arquitectura de Grafo DAG por Ramas de Carrera y Prerrequisitos
- **ADR-008:** Adopción Definitiva de NestJS como Motor de Backend
- **ADR-009:** Persistencia Híbrida Políglota (MongoDB Contenido + Supabase Transacciones)
- **ADR-010:** Arquitectura Backend Hexagonal Modular con Eventos de Dominio y Cache-Aside
- **ADR-011:** Refinamiento de Arquitectura Backend (BullMQ, Persistencia Desacoplada, Caché Versionada, DAG)
- **ADR-012:** Adopción de Arquitectura Híbrida GraphQL y REST en Backend NestJS

