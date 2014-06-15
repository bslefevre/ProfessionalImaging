CREATE TABLE [dbo].[Attendee]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [Contract] VARCHAR(50) NOT NULL, 
	[Company] VARCHAR(200) NULL,
    [Initials] VARCHAR(50) NULL, 
    [Surname] VARCHAR(100) NULL, 
    [Emailaddress] VARCHAR(200) NULL, 
    [HasCoupon] BIT NOT NULL DEFAULT 0, 
    [HasPaid] BIT NOT NULL DEFAULT 0, 
    [Zaterdag] INT NOT NULL DEFAULT 0, 
    [Zondag] INT NOT NULL DEFAULT 0, 
    [Maandag] INT NOT NULL DEFAULT 0, 
    [PassePartout] INT NOT NULL DEFAULT 0, 
    [Barcode] IMAGE NULL
)
