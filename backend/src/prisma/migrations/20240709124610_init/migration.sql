BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [role] NVARCHAR(1000) NOT NULL,
    [resetCode] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Profile] (
    [id] NVARCHAR(1000) NOT NULL,
    [firstName] NVARCHAR(1000) NOT NULL,
    [lastName] NVARCHAR(1000) NOT NULL,
    [bio] NVARCHAR(1000),
    [phone] NVARCHAR(1000),
    [userId] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Profile_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Profile_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Profile_userId_key] UNIQUE NONCLUSTERED ([userId])
);

-- CreateTable
CREATE TABLE [dbo].[Event] (
    [id] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    [startDateTime] DATETIME2 NOT NULL,
    [endDateTime] DATETIME2 NOT NULL,
    [venueId] NVARCHAR(1000) NOT NULL,
    [organizerId] NVARCHAR(1000) NOT NULL,
    [rating] FLOAT(53),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Event_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Event_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Venue] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [address] NVARCHAR(1000) NOT NULL,
    [capacity] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Venue_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Venue_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Ticket] (
    [id] NVARCHAR(1000) NOT NULL,
    [eventId] NVARCHAR(1000) NOT NULL,
    [type] NVARCHAR(1000) NOT NULL,
    [price] FLOAT(53) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ticket_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Ticket_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Registration] (
    [id] NVARCHAR(1000) NOT NULL,
    [eventId] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Registration_status_df] DEFAULT 'pending',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Registration_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Registration_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[EventImage] (
    [id] NVARCHAR(1000) NOT NULL,
    [eventId] NVARCHAR(1000) NOT NULL,
    [url] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [EventImage_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [EventImage_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[_RegistrationToTicket] (
    [A] NVARCHAR(1000) NOT NULL,
    [B] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [_RegistrationToTicket_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_RegistrationToTicket_B_index] ON [dbo].[_RegistrationToTicket]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[Profile] ADD CONSTRAINT [Profile_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Event] ADD CONSTRAINT [Event_venueId_fkey] FOREIGN KEY ([venueId]) REFERENCES [dbo].[Venue]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Event] ADD CONSTRAINT [Event_organizerId_fkey] FOREIGN KEY ([organizerId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ticket] ADD CONSTRAINT [Ticket_eventId_fkey] FOREIGN KEY ([eventId]) REFERENCES [dbo].[Event]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Registration] ADD CONSTRAINT [Registration_eventId_fkey] FOREIGN KEY ([eventId]) REFERENCES [dbo].[Event]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Registration] ADD CONSTRAINT [Registration_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[EventImage] ADD CONSTRAINT [EventImage_eventId_fkey] FOREIGN KEY ([eventId]) REFERENCES [dbo].[Event]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_RegistrationToTicket] ADD CONSTRAINT [_RegistrationToTicket_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Registration]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_RegistrationToTicket] ADD CONSTRAINT [_RegistrationToTicket_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Ticket]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
