FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["FelineFeeder.Api/FelineFeeder.Api.csproj", "FelineFeeder.Api/"]
COPY ["FelineFeeder.Core/FelineFeeder.Core.csproj", "FelineFeeder.Core/"]
COPY ["FelineFeeder.Infrastructure/FelineFeeder.Infrastructure.csproj", "FelineFeeder.Infrastructure/"]
COPY ["FelineFeeder.Application/FelineFeeder.Application.csproj", "FelineFeeder.Application/"]
COPY ["Backend.slnx", "."]

RUN dotnet restore "Backend.slnx"

COPY . .

RUN dotnet publish "FelineFeeder.Api/FelineFeeder.Api.csproj" -c Release -o /app/publish

ENTRYPOINT ["dotnet", "FelineFeeder.Api.dll"]
