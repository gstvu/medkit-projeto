-- ==========================================================
-- SISTEMA MEDKIT - SCRIPT DE CRIAÇÃO DO BANCO DE DADOS
-- SGBD Alvo: MySQL 8+ / MariaDB
-- Alinhado 100% com o Front-end e o Models (Node.js + mysql2)
-- ==========================================================

-- 1. Cria e seleciona o banco de dados
CREATE DATABASE IF NOT EXISTS medkit_db
DEFAULT CHARACTER SET utf8mb4
DEFAULT COLLATE utf8mb4_unicode_ci;

USE medkit_db;

-- Remove tabelas antigas caso você precise rodar o script novamente do zero
DROP TABLE IF EXISTS movimentacao;
DROP TABLE IF EXISTS material_hospitalar;
DROP TABLE IF EXISTS anestesico;
DROP TABLE IF EXISTS vacina;
DROP TABLE IF EXISTS medicamento;
DROP TABLE IF EXISTS item_estoque;
DROP TABLE IF EXISTS medico;

-- ==========================================================
-- 2. TABELA DE MÉDICOS / USUÁRIOS (Tela de Login)
-- ==========================================================
CREATE TABLE medico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    crm VARCHAR(30) NOT NULL UNIQUE,
    especialidade VARCHAR(80),
    cargo_funcao VARCHAR(80),
    senha VARCHAR(255) NOT NULL
);

-- ==========================================================
-- 3. TABELA PRINCIPAL DE ITENS DO ESTOQUE (Superclasse)
-- As colunas possuem os mesmos nomes usados no models do Back-end
-- ==========================================================
CREATE TABLE item_estoque (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    category ENUM('Medicamento', 'Anestésico', 'Vacina', 'Equipamento') NOT NULL,
    type VARCHAR(100) NOT NULL, -- Subcategoria (ex: 'Controlados', 'Infantil')
    qty INT NOT NULL DEFAULT 0,
    minQty INT NOT NULL DEFAULT 10,
    expiration DATE NULL,
    cooling BOOLEAN NOT NULL DEFAULT FALSE,
    generic BOOLEAN NOT NULL DEFAULT FALSE,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- 4. TABELAS ESPECIALIZADAS (Herança do Modelo Conceitual)
-- Guardam detalhes técnicos específicos de cada categoria
-- ==========================================================

CREATE TABLE medicamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL UNIQUE,
    principio_ativo VARCHAR(120),
    dosagem VARCHAR(50),
    tipo_apresentacao VARCHAR(50),
    CONSTRAINT fk_med_item FOREIGN KEY (item_id) 
        REFERENCES item_estoque(id) ON DELETE CASCADE
);

CREATE TABLE vacina (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL UNIQUE,
    lote VARCHAR(50),
    temp_armaz VARCHAR(30),
    publico_alvo ENUM('Infantil', 'Adulto', 'Geral') DEFAULT 'Geral',
    CONSTRAINT fk_vac_item FOREIGN KEY (item_id) 
        REFERENCES item_estoque(id) ON DELETE CASCADE
);

CREATE TABLE anestesico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL UNIQUE,
    via_admin VARCHAR(60),
    tipo_anest VARCHAR(60),
    CONSTRAINT fk_anest_item FOREIGN KEY (item_id) 
        REFERENCES item_estoque(id) ON DELETE CASCADE
);

CREATE TABLE material_hospitalar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL UNIQUE,
    esteril BOOLEAN NOT NULL DEFAULT FALSE,
    tamanho VARCHAR(30),
    CONSTRAINT fk_mat_item FOREIGN KEY (item_id) 
        REFERENCES item_estoque(id) ON DELETE CASCADE
);

-- ==========================================================
-- 5. TABELA DE MOVIMENTAÇÃO (Auditoria: Entrada e Saída)
-- ==========================================================
CREATE TABLE movimentacao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    medico_id INT NOT NULL,
    item_id INT NOT NULL,
    tipo_acao ENUM('ENTRADA', 'SAIDA') NOT NULL,
    quantidade INT NOT NULL,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    observacao VARCHAR(255),
    CONSTRAINT fk_mov_medico FOREIGN KEY (medico_id) 
        REFERENCES medico(id) ON DELETE RESTRICT,
    CONSTRAINT fk_mov_item FOREIGN KEY (item_id) 
        REFERENCES item_estoque(id) ON DELETE CASCADE
);

-- ==========================================================
-- 6. DADOS INICIAIS (Baseados na Planilha Oficial do Projeto)
-- ==========================================================

-- 6.1 Médicos / Usuários do Laboratório
INSERT INTO medico (nome, crm, especialidade, cargo_funcao, senha) VALUES
('Dr. Roberto Silva', 'CRM-SP 123456', 'Clínica Geral', 'Médico Chefe', '123456'),
('Dra. Ana Costa', 'CRM-SP 654321', 'Anestesiologia', 'Plantonista', '123456'),
('Dr. Carlos Mendes', 'CRM-SP 789012', 'Cirurgia Geral', 'Cirurgião', '123456'),
('Dra. Juliana Lima', 'CRM-SP 345678', 'Pediatria / Imunização', 'Responsável Vacinas', '123456');

-- 6.2 Todos os Itens na Tabela Principal (IDs 1 a 32)
INSERT INTO item_estoque (name, category, type, qty, minQty, expiration, cooling, generic, price) VALUES
-- Medicamentos (IDs 1 a 8)
('Clonazepam', 'Medicamento', 'Controlados', 50, 10, '2025-12-01', FALSE, TRUE, 15.50),
('Dipirona', 'Medicamento', 'Regulares', 5, 20, '2024-05-15', FALSE, TRUE, 2.00),
('Amoxicilina', 'Medicamento', 'Uso Supervisionado', 80, 20, '2026-08-20', FALSE, TRUE, 18.90),
('Paracetamol', 'Medicamento', 'Regulares', 120, 30, '2027-03-10', FALSE, TRUE, 8.50),
('Morfina', 'Medicamento', 'Controlados', 12, 10, '2026-06-15', FALSE, FALSE, 32.00),
('Insulina NPH', 'Medicamento', 'Uso Supervisionado', 25, 15, '2026-04-30', TRUE, FALSE, 48.00),
('Omeprazol', 'Medicamento', 'Regulares', 90, 25, '2027-01-25', FALSE, TRUE, 12.40),
('Diazepam', 'Medicamento', 'Controlados', 35, 15, '2026-11-12', FALSE, TRUE, 9.80),

-- Anestésicos (IDs 9 a 13)
('Noradrenalina', 'Anestésico', 'Restritos', 15, 10, '2024-11-20', TRUE, FALSE, 45.00),
('Lidocaína 2%', 'Anestésico', 'Regulares', 40, 15, '2027-05-18', FALSE, TRUE, 14.00),
('Propofol', 'Anestésico', 'Restritos', 18, 10, '2026-09-01', TRUE, FALSE, 55.00),
('Bupivacaína', 'Anestésico', 'Regulares', 22, 10, '2026-12-10', FALSE, TRUE, 28.50),
('Fentanil', 'Anestésico', 'Restritos', 8, 10, '2026-07-22', FALSE, FALSE, 62.00),

-- Vacinas (IDs 14 a 18)
('BCG', 'Vacina', 'Infantil', 120, 50, '2026-01-10', TRUE, FALSE, 30.00),
('Hepatite B', 'Vacina', 'Infantil', 85, 30, '2027-02-14', TRUE, FALSE, 35.00),
('Influenza (Gripe)', 'Vacina', 'Adulto', 200, 50, '2026-10-30', TRUE, FALSE, 42.00),
('Tríplice Viral (SCR)', 'Vacina', 'Infantil', 60, 25, '2026-08-19', TRUE, FALSE, 38.50),
('Antitetânica (dT)', 'Vacina', 'Adulto', 95, 30, '2027-06-05', TRUE, FALSE, 27.00),

-- Equipamentos e Materiais Hospitalares (IDs 19 a 32)
('Luvas de Procedimento', 'Equipamento', 'Proteção Individual e Biossegurança', 0, 100, NULL, FALSE, FALSE, 25.00),
('Máscara Cirúrgica Tripla', 'Equipamento', 'Proteção Individual e Biossegurança', 300, 100, '2028-01-01', FALSE, FALSE, 18.00),
('Óculos de Proteção', 'Equipamento', 'Proteção Individual e Biossegurança', 25, 10, NULL, FALSE, FALSE, 12.50),
('Seringa Descartável 5ml', 'Equipamento', 'Acesso Venoso e Infusão', 250, 80, '2028-05-10', FALSE, FALSE, 0.85),
('Cateter Intravenoso 20G', 'Equipamento', 'Acesso Venoso e Infusão', 140, 40, '2027-11-20', FALSE, FALSE, 2.40),
('Equipo Macrogotas', 'Equipamento', 'Acesso Venoso e Infusão', 110, 30, '2027-09-15', FALSE, FALSE, 3.10),
('Máscara de Oxigênio com Reservatório', 'Equipamento', 'Cuidados Respiratórios e Ventilação', 30, 10, '2028-03-01', FALSE, FALSE, 19.90),
('Cateter Nasal tipo Óculos', 'Equipamento', 'Cuidados Respiratórios e Ventilação', 45, 15, '2027-12-01', FALSE, FALSE, 4.50),
('Gaze Estéril (Pacote c/ 10)', 'Equipamento', 'Curativos e Cuidados com Feridas', 180, 50, '2027-08-30', FALSE, FALSE, 1.90),
('Esparadrapo Impermeável', 'Equipamento', 'Curativos e Cuidados com Feridas', 40, 15, '2027-04-12', FALSE, FALSE, 8.90),
('Sonda Vesical de Demora (Foley)', 'Equipamento', 'Sondagem, Drenagem e Eliminação', 35, 10, '2027-10-10', FALSE, FALSE, 6.75),
('Coletor de Urina Sistema Fechado', 'Equipamento', 'Sondagem, Drenagem e Eliminação', 50, 15, '2027-11-05', FALSE, FALSE, 9.20),
('Lâmina de Bisturi nº 15', 'Equipamento', 'Materiais Cirúrgicos e de Campo Operatório', 100, 30, '2028-07-01', FALSE, FALSE, 1.20),
('Fio de Sutura Nylon 3-0', 'Equipamento', 'Materiais Cirúrgicos e de Campo Operatório', 75, 20, '2028-02-18', FALSE, FALSE, 5.80);

-- 6.3 Detalhes Específicos: Medicamentos (IDs 1 a 8)
INSERT INTO medicamento (item_id, principio_ativo, dosagem, tipo_apresentacao) VALUES
(1, 'Clonazepam', '2mg', 'Comprimido'),
(2, 'Dipirona Monoidratada', '500mg', 'Comprimido'),
(3, 'Amoxicilina Tri-hidratada', '500mg', 'Cápsula'),
(4, 'Paracetamol', '750mg', 'Comprimido'),
(5, 'Sulfato de Morfina', '10mg/ml', 'Ampola'),
(6, 'Insulina Humana NPH', '100UI/ml', 'Frasco-ampola'),
(7, 'Omeprazol', '20mg', 'Cápsula'),
(8, 'Diazepam', '10mg', 'Comprimido');

-- 6.4 Detalhes Específicos: Anestésicos (IDs 9 a 13)
INSERT INTO anestesico (item_id, via_admin, tipo_anest) VALUES
(9, 'Intravenosa', 'Vasopressor / Uso Hospitalar'),
(10, 'Infiltrativa / Tópica', 'Anestésico Local'),
(11, 'Intravenosa', 'Anestésico Geral'),
(12, 'Raquidiana / Peridural', 'Anestésico Local'),
(13, 'Intravenosa', 'Analgésico Opioide / Anestésico');

-- 6.5 Detalhes Específicos: Vacinas (IDs 14 a 18)
INSERT INTO vacina (item_id, lote, temp_armaz, publico_alvo) VALUES
(14, 'LOTE-BCG-01', '2°C a 8°C', 'Infantil'),
(15, 'LOTE-HEPB-04', '2°C a 8°C', 'Infantil'),
(16, 'LOTE-FLU-26', '2°C a 8°C', 'Adulto'),
(17, 'LOTE-SCR-09', '2°C a 8°C', 'Infantil'),
(18, 'LOTE-DT-12', '2°C a 8°C', 'Adulto');

-- 6.6 Detalhes Específicos: Equipamentos / Materiais Hospitalares (IDs 19 a 32)
INSERT INTO material_hospitalar (item_id, esteril, tamanho) VALUES
(19, FALSE, 'M'),
(20, FALSE, 'Único'),
(21, FALSE, 'Único'),
(22, TRUE, '5ml'),
(23, TRUE, '20G'),
(24, TRUE, 'Padrão'),
(25, FALSE, 'Adulto'),
(26, TRUE, 'Adulto'),
(27, TRUE, '7,5x7,5cm'),
(28, FALSE, '10cm x 4,5m'),
(29, TRUE, '16Fr'),
(30, TRUE, '2000ml'),
(31, TRUE, 'Nº 15'),
(32, TRUE, '3-0');

-- 6.7 Histórico Inicial de Movimentações
INSERT INTO movimentacao (medico_id, item_id, tipo_acao, quantidade, observacao) VALUES
(1, 2, 'SAIDA', 15, 'Retirada para sala de emergência'),
(2, 9, 'SAIDA', 5, 'Uso em procedimento cirúrgico'),
(4, 14, 'ENTRADA', 50, 'Reposição de lote mensal');