FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["BrekkieBeacon.Api/BrekkieBeacon.Api.csproj", "BrekkieBeacon.Api/"]
COPY ["BrekkieBeacon.Core/BrekkieBeacon.Core.csproj", "BrekkieBeacon.Core/"]
COPY ["BrekkieBeacon.Infrastructure/BrekkieBeacon.Infrastructure.csproj", "BrekkieBeacon.Infrastructure/"]
COPY ["BrekkieBeacon.Application/BrekkieBeacon.Application.csproj", "BrekkieBeacon.Application/"]
COPY ["BrekkieBeacon.slnx", "."]

RUN dotnet restore "BrekkieBeacon.slnx"

COPY . .

RUN dotnet publish "BrekkieBeacon.Api/BrekkieBeacon.Api.csproj" -c Release -o /app/publish

ENTRYPOINT ["dotnet", "BrekkieBeacon.Api.dll"]
