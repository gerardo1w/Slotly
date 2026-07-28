CREATE DATABASE IF NOT EXISTS reserva_canchas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE reserva_canchas;

CREATE TABLE IF NOT EXISTS tcomplex (
    idComplex VARCHAR(255) NOT NULL,
    name VARCHAR(255) NULL,
    address VARCHAR(255) NULL,
    district VARCHAR(255) NULL,
    ownerId VARCHAR(255) NULL,
    status VARCHAR(50) NULL,
    phone VARCHAR(255) NULL,
    image VARCHAR(255) NULL,
    rating DOUBLE NULL,
    reviewsCount INT NULL,
    pitchesCount INT NULL,
    timeRange VARCHAR(255) NULL,
    active BOOLEAN DEFAULT TRUE NULL,
    createdAt DATETIME NULL,
    updatedAt DATETIME NULL,
    PRIMARY KEY (idComplex)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tpitch (
    idPitch VARCHAR(255) NOT NULL,
    complexId VARCHAR(255) NOT NULL,
    name VARCHAR(255) NULL,
    sport VARCHAR(255) NULL,
    pricePerHour DOUBLE NULL,
    image VARCHAR(255) NULL,
    active BOOLEAN NULL,
    createdAt DATETIME NULL,
    updatedAt DATETIME NULL,
    PRIMARY KEY (idPitch),
    CONSTRAINT fk_pitch_complex
        FOREIGN KEY (complexId) REFERENCES tcomplex(idComplex)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tbooking (
    idBooking VARCHAR(255) NOT NULL,
    pitchId VARCHAR(255) NOT NULL,
    complexId VARCHAR(255) NOT NULL,
    complexName VARCHAR(255) NULL,
    pitchName VARCHAR(255) NULL,
    sport VARCHAR(255) NULL,
    clientName VARCHAR(255) NULL,
    clientEmail VARCHAR(255) NULL,
    date VARCHAR(255) NULL,
    timeSlot VARCHAR(255) NULL,
    price DOUBLE NULL,
    status VARCHAR(50) NULL,
    paymentMethod VARCHAR(255) NULL,
    createdAt DATETIME NULL,
    updatedAt DATETIME NULL,
    PRIMARY KEY (idBooking),
    CONSTRAINT fk_booking_pitch
        FOREIGN KEY (pitchId) REFERENCES tpitch(idPitch)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_booking_complex
        FOREIGN KEY (complexId) REFERENCES tcomplex(idComplex)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS ttransaction (
    idTransaction VARCHAR(255) NOT NULL,
    complexId VARCHAR(255) NOT NULL,
    type VARCHAR(50) NULL,
    description VARCHAR(255) NULL,
    amount DOUBLE NULL,
    date VARCHAR(255) NULL,
    createdAt DATETIME NULL,
    updatedAt DATETIME NULL,
    PRIMARY KEY (idTransaction),
    CONSTRAINT fk_transaction_complex
        FOREIGN KEY (complexId) REFERENCES tcomplex(idComplex)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tclosure (
    idClosure VARCHAR(255) NOT NULL,
    complexId VARCHAR(255) NOT NULL,
    date VARCHAR(255) NULL,
    totalIncomes DOUBLE NULL,
    totalExpenses DOUBLE NULL,
    finalBalance DOUBLE NULL,
    closedBy VARCHAR(255) NULL,
    createdAt DATETIME NULL,
    updatedAt DATETIME NULL,
    PRIMARY KEY (idClosure),
    CONSTRAINT fk_closure_complex
        FOREIGN KEY (complexId) REFERENCES tcomplex(idComplex)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tuser (
    idUser VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NULL,
    name VARCHAR(255) NULL,
    role VARCHAR(50) NULL,
    subscription VARCHAR(50) NULL,
    complexId VARCHAR(255) NULL,
    blocked BOOLEAN NULL,
    createdAt DATETIME NULL,
    updatedAt DATETIME NULL,
    PRIMARY KEY (idUser),
    UNIQUE KEY uk_tuser_email (email),
    CONSTRAINT fk_user_complex
        FOREIGN KEY (complexId) REFERENCES tcomplex(idComplex)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_pitch_complex ON tpitch(complexId);
CREATE INDEX idx_booking_complex ON tbooking(complexId);
CREATE INDEX idx_booking_pitch ON tbooking(pitchId);
CREATE INDEX idx_booking_client_email ON tbooking(clientEmail);
CREATE INDEX idx_transaction_complex ON ttransaction(complexId);
CREATE INDEX idx_closure_complex ON tclosure(complexId);
CREATE INDEX idx_user_complex ON tuser(complexId);
